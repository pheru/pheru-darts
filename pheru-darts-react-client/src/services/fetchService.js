export function fetchGet(url, onSuccess, onResponseNotOK, onError) {
    return baseFetch(url, 'GET', {}, onSuccess, onResponseNotOK, onError);
}

export function fetchPost(url, data, onSuccess, onResponseNotOK, onError) {
    return baseFetch(url, 'POST', data, onSuccess, onResponseNotOK, onError);
}

export function fetchPut(url, data, onSuccess, onResponseNotOK, onError) {
    return baseFetch(url, 'PUT', data, onSuccess, onResponseNotOK, onError);
}

export function fetchDelete(url, onSuccess, onResponseNotOK, onError) {
    return baseFetch(url, 'DELETE', {}, onSuccess, onResponseNotOK, onError);
}

function baseFetch(url, method, data, onSuccess, onResponseNotOK, onError) {
    let fetchParameter;
    if (method === 'POST' || method === 'PUT') {
        fetchParameter = {
            body: JSON.stringify(data),
            headers: {'content-type': 'application/json'},
            method: method
        }
    }
    return fetch(url, fetchParameter)
        .then(response => {
            if (response.ok) {
                return response.json();
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
