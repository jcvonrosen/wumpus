const utilities = {
    Random: (low, high) => {
        return Math.floor(Math.random() * (high-low)) + low ;
    }
}

export default utilities;