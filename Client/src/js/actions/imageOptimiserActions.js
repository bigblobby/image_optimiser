// Action types

const updateDisplayAndUploadFilesAction = (images) => ({
    type: "ADD_IMAGES",
    payload: images
});

const removeImageAction = (id) => ({
    type: "REMOVE_IMAGE",
    payload: id
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

