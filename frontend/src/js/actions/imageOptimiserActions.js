// Action types

const updateDisplayAndUploadFilesAction = (images) => ({
    type: "ADD_IMAGES",
    payload: images
});

const removeImageAction = (id) => ({
    type: "REMOVE_IMAGE",
    payload: id
});

const triggerUploadCompleteAction = (data) => ({
    type: "UPLOAD_COMPLETE",
    payload: data
});

const updateProgressAction = (percent) => ({
    type: "UPDATE_PROGRESS",
    payload: percent
});

const updateErrorAction = (message) => ({
    type: "ERROR",
    payload: message
});

const resetOptimiserAction = () => ({
    type: "RESET"
});

// Action creators

export function updateDisplayAndUploadFiles(images){
    return function(dispatch){
        dispatch(updateDisplayAndUploadFilesAction(images));
    }
}

export function removeImage(id){
    return function(dispatch){
        dispatch(removeImageAction(id));
    }
}

export function triggerUploadComplete(data){
    return function(dispatch){
        dispatch(triggerUploadCompleteAction(data))
    }
}

export function updateProgress(percent){
    return function(dispatch){
        dispatch(updateProgressAction(percent))
    }
}

export function updateErrorMessage(message){
    return function(dispatch){
        dispatch(updateErrorAction(message));
    }
}

export function resetOptimiser(){
    return function(dispatch){
        dispatch(resetOptimiserAction());
    }
}

