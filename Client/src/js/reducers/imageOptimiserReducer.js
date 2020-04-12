const initialState = {
    images: [],
    downloadFile: {
        image: null,
        filename: null
    },
    dragging: false,
    uploading: false,
    percentCompleted: null,
    uploadComplete: false,
    error: null
};

function imageOptimiserReducer(state = initialState, action){
    switch(action.type){
        case "ADD_IMAGES":
            return {
                ...state,
                images: [...state.images, ...action.payload]
            };
        case "REMOVE_IMAGE":
            const images = [...state.images].filter(file => file.id !== action.payload);
            return {
                ...state,
                images: images
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
