const utils = {
    getContent: (str) => {
        if (!str) return
        let result = ''
        let flag = false
        for (let char of str) {
            if (char === '>') {
                flag = true
            }
            if (char === '<') {
                flag = false
            }
            if (flag && char !== '>') {
                result = result + char
            }
        }
        return result
    }
}
export default utils