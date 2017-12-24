module.exports = {
    checkPosIntNumber : function(string){
        if (string){
            let res = Number(parseInt(string));
            if (isNaN(res) || res < 0)
                return undefined;
            return res;
        }
        return undefined;
    },
    checkID : function(id){
        if (id){
            return id;
        } else {
            return undefined;
        }
    }
}