class FetchUtil {

    static DEFAULT_TIMEOUT = 30000;
    static LOGIN_BY_TOKEN_TIMEOUT = 5000;

    static fetchGet(url, onSuccess, onResponseNotOK, onError, timeout) {
        return baseFetch(url, 'GET', {}, onSuccess, onResponseNotOK, onError, timeout);
    }

    static fetchPost(url, data, onSuccess, onResponseNotOK, onError, timeout) {
        return baseFetch(url, 'POST', data, onSuccess, onResponseNotOK, onError, timeout);
    }

    static fetchPut(url, data, onSuccess, onResponseNotOK, onError, timeout) {
        return baseFetch(url, 'PUT', data, onSuccess, onResponseNotOK, onError, timeout);
    }

    static fetchDelete(url, data, onSuccess, onResponseNotOK, onError, timeout) {
        return baseFetch(url, 'DELETE', data, onSuccess, onResponseNotOK, onError, timeout);
    }
}

function withTimeout(ms, promise) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(new Error("Zeitüberschreitung"))
        }, ms);
        promise.then(resolve, reject)
    })
}

function baseFetch(url, method, data, onSuccess, onResponseNotOK, onError, timeout) {
    let fetchParameter = {
        credentials: 'include'
    };
    if (method !== 'GET') {
        fetchParameter = {
            body: JSON.stringify(data),
            headers: {'content-type': 'application/json'},
            method: method,
            credentials: 'include'
        }
    }
    let timeoutMillis = timeout ? timeout : FetchUtil.DEFAULT_TIMEOUT;
    return withTimeout(timeoutMillis, fetch(url, fetchParameter))
        .then(response => {
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json();
                } else if (contentType && contentType.indexOf("text/plain") !== -1) {
                    return response.text();
                }
                return "";
            }
            return response.json()
                .then(json => {
                    onResponseNotOK(json);
                    return Promise.reject("Error fetching " + url + ": Status: " + json.status + "; Message: " + json.message)
                });
        }, error => {
            onError(error);
            return Promise.reject("Error fetching " + url + ": " + error);
        })
        .then(json => onSuccess(json), error => console.error(error))
}

export default FetchUtil;