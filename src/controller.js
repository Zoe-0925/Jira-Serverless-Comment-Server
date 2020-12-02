const API = require('@aws-amplify/api')


const checkLastUpdate = async (data, api, url) => {
    try {
        const lastUpdatedAt = await API.get(api, url + data._id + "/updatedAt")
        return (lastUpdatedAt === data.upatedAt)
    } catch (err) {
        return { error: err }
    }
}

exports.create = async (payload, api, url) => {
    try {
        const updatedAt = await API.post(api, url, { body: payload })
        return { payload:payload, updatedAt: updatedAt }
    } catch (error) {
        return { error: err }
    }
}

exports.updateAttribute = async (payload, api, url) => {
    try {
        const isUpdateValid = checkLastUpdate(payload, api, url)
        if (!isUpdateValid) { return ({ error: "The resource is being updated by another user." }) }
        return await API.put(api, url, { body: payload })
    } catch (error) {
        return { error: err }
    }
}

exports.delete = async (payload, api, url) => {
    try {
        const isUpdateValid = checkLastUpdate(payload, api, url)
        if (!isUpdateValid) { return ({ error: "The resource is being updated by another user." }) }
        return await API.del(api, url + payload._id)
    }
    catch (err) {
        return { error: err }
    }
}

