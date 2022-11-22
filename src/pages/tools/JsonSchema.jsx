import React from 'react';
import StandardLayout from '../../layouts/StandardLayout'
import {Row, Col, Button} from "antd"
import {JsonEditor as Editor} from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import {isArray} from "jsoneditor/src/js/util";

export default class JsonSchema extends React.Component {
    schemaEditor = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            json: {},
            schema: {}
        }
    }

    handleChange = (change) => {
        this.setState({
            json: change
        })
    };

    generateSchema = () => {
        let schema = {};
        schema['$schema'] = "http://json-schema.org/draft-04/schema";
        Object.assign(schema, this.getDef(this.state.json));
        this.setState({
            schema: schema
        });

        this.schemaEditor.current.jsonEditor.set(schema)
    };

    getDef(object) {
        let jstype = typeof object;
        switch (jstype) {
            case "object":
                return this.analyseObjectType(object);
            case "string":
                return this.analyseString(object);
            case "number":
                return this.analyseNumber(object);
            default:
                return {
                    type: jstype
                }
        }
    }

    analyseNumber(number) {
        //không phân biệt được float và integer nên tạm luôn coi là number, muốn validate thì tự xử
        return {
            type: "number"
        }
    }

    analyseString(string) {
        if (string === "null") {
            return {
                type: ["string", "null"]
            }
        }

        if (string.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)) {
            return {
                type: "string",
                format: "date-time"
            }
        }

        if (string.match(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)) {
            return {
                type: "string",
                pattern: "\\b[0-9a-f]{8}\\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\\b[0-9a-f]{12}\\b"
            }
        }

        if (string.indexOf('@')>0) {
            return {
                type: "string",
                format: "email"
            }
        }

        return {type: "string"};
    }

    analyseObjectType(object) {
        //case array
        if (isArray(object)) {
            if (object.length === 0)
                return {
                    type: 'array'
                };

            if (typeof (object[0]) ==='object' && !isArray(object[0])) {
                return {
                    type: 'array',
                    items: this.getObjDefFromArray(object)
                }
            }

            return {
                type: 'array',
                items: this.getDef(object[0])
            }
        }
        //case object not null
        if (object)
            return {
                type: 'object',
                required: Object.keys(object),
                properties: this.getObjectProperties(object)
            };

        return {
            type: 'null'
        }
    }

    getObjDefFromArray(array) {
        let required = Object.keys(array[0]);
        for (let obj of array) {
            let newRequired = Object.keys(obj);
            console.info(newRequired);
            required = required.filter((item) => newRequired.indexOf(item) >= 0);
        }

        return {
            type: 'object',
            required: required,
            properties: this.getObjectPropertiesFromArray(array, required)
        };
    }

    getObjectProperties(object) {
        let keys = Object.keys(object);
        let properties = {};
        for (let key of keys) {
            properties[key] = this.getDef(object[key])
        }

        return properties
    }

    getObjectPropertiesFromArray(array, keys) {
        let properties = {};
        for (let key of keys) {
            let nullable = false;
            for (let object of array) {
                if (!object[key]) {
                    nullable = true;
                }
            }

            for (let object of array) {
                if (object[key]) {
                    properties[key] = this.getDef(object[key]);
                    break;
                }
            }

            if (properties[key] && nullable && properties[key].type!=="null") {
                properties[key].type = [properties[key].type, "null"]
            }
        }

        return properties
    }

    render() {
        return <StandardLayout activeMenu={['json_schema']} title={'JSON Schema generator tool'}
                               {...this.props}>
            <Button onClick={this.generateSchema}>Generate Schema</Button>
            <Row>
                <Col span={12}>
                    <Editor value={this.state.json} mode={'code'}
                            onChange={this.handleChange}
                            theme="ace/theme/github"
                            ace={ace}
                            htmlElementProps={{style: {height: '400px'}}}
                            search={true}
                            allowedModes={['tree', 'code', 'view']}
                    />
                </Col>
                <Col span={12}>
                    <Editor value={this.state.schema} mode={'code'}
                            onChange={this.handleChange}
                            theme="ace/theme/github"
                            ace={ace}
                            htmlElementProps={{style: {height: '400px'}}}
                            search={true}
                            allowedModes={['tree', 'code', 'view']}
                            ref={this.schemaEditor}
                    />
                </Col>
            </Row>
        </StandardLayout>
    }
}