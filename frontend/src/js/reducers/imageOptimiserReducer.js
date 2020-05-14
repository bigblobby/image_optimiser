const initialState = {
    images: [],
    downloadImage: null,
    downloadFilename: null,
    uploading: false,
    percentCompleted: null,
    uploadComplete: false,
    error: null,
};

function imageOptimiserReducer(state = initialState, action){
    switch(action.type){
        case "ADD_IMAGES":
            return {
                ...state,
                error: null,
                images: [...state.images, ...action.payload]
            };
        case "REMOVE_IMAGE":
            const images = [...state.images].filter(file => file.id !== action.payload);
            return {
                ...state,
                images: images
            };
        case "UPLOAD_COMPLETE":
            return {
                ...state,
                uploading: false,
                uploadComplete: true,
                ...action.payload
            };
        case "UPDATE_PROGRESS":
            return {
                ...state,
                uploading: true,
                error: null,
                uploadComplete: false,
                percentCompleted: action.payload
            };
        case "RESET":
            return {
                ...state,
                images: [],
                downloadImage: null,
                downloadFilename: null,
                uploading: false,
                percentCompleted: null,
                uploadComplete: false,
                error: null
            };
        case "ERROR":
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
}

export default imageOptimiserReducer;
