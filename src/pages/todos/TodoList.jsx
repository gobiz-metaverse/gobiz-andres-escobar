import React, {useContext, useEffect, useRef, useState} from "react";
import StandardLayout from "../../layouts/StandardLayout";
import {Button, Table, Checkbox, Form, Input, DatePicker} from "antd";
import {LocalStore} from "../../utils/LocalStore";
import moment from "moment";
import TodoService from "../../services/todo/TodoService";
import {BUGS} from "../../services/todo/TodoBugs";
import {DeleteFilled} from '@ant-design/icons';
import md5 from "blueimp-md5";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                      }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} bordered={false}/>
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

export default class TodoList extends React.Component {

    columns = [
        {
            title: 'Action', dataIndex: 'action', key: 'action', width: 25, render: (text, record) => {
                return <Checkbox checked={record.is_done} onChange={(e) => {
                    let tasks = this.state.tasks;
                    let task = tasks.find(t=>t.id ===record.id);
                    if (task) {
                        task.is_done = e.target.checked;
                        task.finished_date = task.is_done ? new Date() : null;
                    }
                    TodoService.getDefaultInstance().saveAllTasks(tasks);
                    this.setState({
                        tasks: tasks
                    })
                }
                }/>
            }
        },
        {
            title: 'Task', dataIndex: 'title', key: 'title', className: 'title', editable: true
        },
        {
            title: 'Due date', dataIndex: 'due_date', key: 'due_date', render: (text, task) => {
                return task.is_done ? <span>{moment(task.due_date).format('DD/MM/YYYY')}</span> : <DatePicker
                    onChange={(date, dateString) => {
                        this.changeDueDate(task, date, dateString)
                    }}
                    bordered={false}
                    value={task.due_date ? moment(task.due_date) : null}
                    disabledDate={this.disabledDate}
                />
                //return <span>{moment(record.due_date).format('DD/MM/YYYY')}</span>
            }
        },
        {
            title: 'Action', dataIndex: 'action', key:'action', render: (text, task) => {
                return <Button size={'small'} icon={<DeleteFilled />} onClick={()=>{
                    let tasks = this.state.tasks;
                    tasks = tasks.filter(t=>t.id !== task.id);
                    TodoService.getDefaultInstance().saveAllTasks(tasks);
                    this.setState({tasks:tasks});
                }
                }/>;
            }
        }
    ];

    disabledDate = (current)=> {
        let days = BUGS.DUE_DATE_TODAY_NOT_INCLUDED ? 0 : -1;
        return current && current < moment().add(days, 'days').endOf('day');
    };

    changeDueDate = (task, date, dateString) =>{
        let tasks = this.state.tasks;
        tasks.find(t=>t.id === task.id).due_date = date ? new Date(date) : null;
        TodoService.getDefaultInstance().saveAllTasks(tasks);
        this.setState({tasks:tasks});
    };

    constructor(props) {
        super(props);
        this.state = {
            tasks: []
        }
    }

    componentDidMount() {
        let service = TodoService.getDefaultInstance();
        service.getTasks().then(response => {
            this.setState({
                tasks: response.body
            })
        });
    }

    logout = () => {
        LocalStore.getInstance().save('todo_session', null);
        this.props.history.push('/todos/login');
    };

    addTask = () => {
        let tasks = this.state.tasks;
        let newTask = {id: md5(new Date()) + Math.random() ,title: 'New task'};
        tasks = [...tasks, newTask];
        TodoService.getDefaultInstance().saveAllTasks(tasks).then(()=> {
            this.setState({tasks:tasks}, ()=> {
                this.forceUpdate()
            });
        });
    };

    render() {
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: BUGS.TASK_DONE_EDITABLE || !record.is_done,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: (record)=> {
                        let tasks = this.state.tasks;
                        tasks.find(t=>t.id === record.id).title = record.title;
                        TodoService.getDefaultInstance().saveAllTasks(tasks);
                        this.setState({tasks:tasks});
                    },
                }),
            };
        });

        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };

        return <StandardLayout>
            <div className={'todo'}>
                <div>
                    <Button type={'link'} onClick={this.logout}>Logout</Button>
                </div>
                <div style={{maxWidth: '600px'}} className={'task-list'}>
                    <Table
                        components={components}
                        rowKey={'id'}
                        rowClassName={(record) => {
                            if (record.is_done) {
                                return 'done'
                            }
                            //current && current < moment().add(days, 'days').endOf('day');
                            if (moment(record.due_date) < moment().endOf('day')
                                && moment(record.due_date) >= moment().startOf('day')
                            ) {
                                return 'today'
                            }

                            if (moment(record.due_date) < moment().add(1, 'days').startOf('day'))
                            {
                                return 'overdue'
                            }
                        }}
                        dataSource={this.state.tasks}
                        columns={columns}
                        pagination={false}
                        size={'middle'}
                        showHeader={false}
                    />
                    <Button type={'primary'} onClick={this.addTask}>Add task</Button>
                </div>
            </div>
        </StandardLayout>
    }
}