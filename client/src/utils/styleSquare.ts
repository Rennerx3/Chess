export const styleSquare = (column: string, row: number) => {
    if((column === 'a' || column === 'c' || column === 'e' || column === 'g') && row % 2 === 0 ){
        return {backgroundColor: '#f0d9b5'};
    } else if((column === 'b' || column === 'd' || column === 'f' || column === 'h') && row % 2 !== 0){
        return {backgroundColor: '#f0d9b5'};
    }else{
        return {backgroundColor: '#b58863'};
    }
}