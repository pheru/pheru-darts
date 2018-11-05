export function fetchGet(url, onSuccess, onResponseNotOK, onError) {
    return baseFetch(url, 'GET', {}, onSuccess, onResponseNotOK, onError);
}

export function fetchPost(url, data, onSuccess, onResponseNotOK, onError) {
    return baseFetch(url, 'POST', data, onSuccess, onResponseNotOK, onError);
}

export function fetchPut(url, data, onSuccess, onResponseNotOK, onError) {
    return baseFetch(url, 'PUT', data, onSuccess, onResponseNotOK, onError);
}

export function fetchDelete(url, data, onSuccess, onResponseNotOK, onError) {
    return baseFetch(url, 'DELETE', data, onSuccess, onResponseNotOK, onError);
}

function baseFetch(url, method, data, onSuccess, onResponseNotOK, onError) {
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
    return fetch(url, fetchParameter)
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
