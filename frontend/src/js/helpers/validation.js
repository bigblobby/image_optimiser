class ValidationHelper {
    validateWidthHeight(value){
        if(value === '') return null;
        if(value.toLowerCase() === 'empty') return null;
        if(value.toLowerCase() === 'auto') return null;
        if(Number.isNaN(Number(value))) return null;
        return Number(value);
    }

    validateQuality(value){
        if(/^0*(?:[1-9][0-9]?|100)$/.test(value)){
            return Number(value);
        }

        return 80;
    }
}

export default new ValidationHelper();


