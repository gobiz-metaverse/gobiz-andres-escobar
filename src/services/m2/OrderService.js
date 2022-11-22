import M2Client from "../M2Client";

export default class OrderService {
    static calculateFee(baseUrl, token, order, cb) {
        M2Client.request({
            endpoint: baseUrl + `/admin/orders/${order}/calculate`,
            method: "POST",
            mode: "free"
        }, token, cb);
    }

    static pay(baseUrl, token, secret, order, cb) {
        M2Client.request({
            endpoint: baseUrl + `/admin/orders/${order}/pay`,
            method: 'POST',
            mode: 'free',
            body: { secret: secret }
        }, token, cb)
    }

    static promisePay(baseUrl, token, secret, order) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/orders/${order}/pay`,
            method: 'POST',
            mode: 'free',
            body: { secret: secret }
        }, token)
    }

    static getDetail(baseUrl, token, order, cb) {
        M2Client.request({
            endpoint: baseUrl + `/admin/orders/${order}`,
            method: 'GET',
            mode: 'free'
        }, token, cb)
    }

    static promiseGetDetail(baseUrl, token, order) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/orders/${order}`,
            method: 'GET',
            mode: 'free'
        }, token)
    }

    static patchOrder(baseUrl, token, order, data) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/orders/${order}`,
            method: 'PATCH',
            mode: 'free',
            body: data
        }, token)
    }

    static patchConfigGroup(baseUrl, token, order, configId, reason) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/orders/${order}/config_group`,
            method: 'PATCH',
            mode: 'free',
            body:
                {"configGroupId":configId,"configGroupReason":reason}
        }, token)
    }

    static patchShipmentConfigGroup(baseUrl, token, order, configId, reason) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/shipments/${order}/config_group`,
            method: 'PATCH',
            mode: 'free',
            body:
                {"configGroupId":configId,"configGroupReason":reason}
        }, token)
    }

    static changeService(baseUrl, token, order, services, cb) {
        M2Client.request({
            endpoint: baseUrl + `/admin/orders/${order}/services`,
            method: 'POST',
            mode: 'free',
            body: services
        }, token, cb)
    }

    static getShipmentDetail(baseUrl, token, order, cb) {
        M2Client.request({
            endpoint: baseUrl + `/admin/shipments/${order}`,
            method: 'GET',
            mode: 'free'
        }, token, cb)
    }

    static promiseGetShipmentDetail(baseUrl, token, order) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/shipments/${order}`,
            method: 'GET',
            mode: 'free'
        }, token)
    }

    static recalculateShipmentFee(baseUrl, token, order) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/shipments/${order}/calculate`,
            method: 'POST',
            mode: 'free'
        }, token)
    }

    static settleShipmentFee(baseUrl, token, order, secret) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/shipments/${order}/settlement`,
            method: 'POST',
            mode: 'free',
            body: {
                secret: secret
            }
        }, token)
    }

    static changeShipmentService(baseUrl, token, order, services, cb) {
        M2Client.request({
            endpoint: baseUrl + `/admin/shipments/${order}/services`,
            method: 'POST',
            mode: 'free',
            body: services
        }, token, cb)
    }

    static getShipmentsCreatedBefore(baseUrl, token, before, page, cb) {
        M2Client.request({
            endpoint: baseUrl + `/admin/shipments?timestampStatus=ACCEPTED&timestampTo=${before}&statuses=ACCEPTED&sort=createdAt:desc&size=100&page=${page}`,
            method: 'GET',
            mode: 'free'
        }, token, cb)
    }

    static changeShipmentStatus(baseUrl, token, secret, code, status) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/shipments/${code}`,
            method: 'PATCH',
            mode: 'free',
            body: {
                status: status,
                secret: secret
            }
        }, token);
    }

    static getLastShipments(baseUrl, token, customer) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/shipments?sort=createdAt:desc&customer=${customer}&size=1`
        }, token)
    }

    static updateInternalExchange(baseUrl, token, order, exchange) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/orders/${order}/internal_exchange_rate`,
            method: 'PATCH',
            body: {
                internalExchangeRate: exchange
            }
        }, token)
    }
}