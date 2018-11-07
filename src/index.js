let regExp = /,(?=,*(([^,"]|"{2})+(,|$))*(("([^"]|"{2})+")|$))/g;
// let regExp = /,(?=([^,"]+,)*("([^"]|"{2})+"|[^",]+$))/g;

/**
 * 
 * cell中出现逗号时会有双引号包围：
 *  "([^"]|"{2})+",
 *  没逗号的：
 *  ([^,"]|"{2})+,
 * 没有逗号的0-n个加一个有逗号的或是$:
 * '323,dw,sdf,w""er,"a,a,a",111,"22,22",555,"3""3,33"",""33"'.replace(/,(?=((([^,"]|"{2})+,)*("([^"]|"{2})+"(,|$))|([^,"]|"{2})+$))/g,'-')
 * '"ss,ee,",323,dw,sdf,w""er,"a,a,a",111,"22,22",555,"3""3,33"",""33",444'.replace(/,(?=((([^,"]|"{2})+,)*("([^"]|"{2})+"(,|$))|([^,"]|"{2})+$))/g,'-')
 * 
 * 不包含逗号的0-n个加上包含逗号的或是$,支持空字段:
 * '323,dw,sdf,w""er,"a,a,a",111,"22,22",555,"3""3,33"",""33"'.replace(/,(?=(([^,"]|"{2})+(,|$))*(("([^"]|"{2})+")|$))/g,'-')
 * '"ss,ee,",323,dw,sdf,w""er,"a,a,a",111,"22,22",555,"3""3,33"",""33",444'.replace(/,(?=(([^,"]|"{2})+(,|$))*(("([^"]|"{2})+")|$))/g,'-')
 * 
 * 
 */


let parse = str =>{
    let list = str.split("\r\n"),
        header = list.shift().split(',').map(s=>s.trim()),
        body = list.slice(0),
        results = [];
    

    body.forEach(element => {
        let item = element.replace(regExp,'$__arsdff__$').replace(/^"|"$/g,"").replace(/"{2}/g,"\"").split(/"?\$__arsdff__\$"?/);
        let line = {};

        header.forEach((o, i)=>{
            line[o] = item[i];
        });

        results.push(line)
    });

    return results;
}

export const csv = (input, callback)=>{
    if(!input || typeof callback !== 'function'){
        return null;
    }

    if(typeof input === 'string'){
        let file = input,
            rawFile = new XMLHttpRequest()
        ; 

        rawFile.open("GET", file, false); 

        rawFile.onreadystatechange = function() { 
            if(rawFile.status === 200 || rawFile.status == 0){
                callback(parse(rawFile.responseText));
            }
        }; 

        rawFile.send(); 
    }else if(typeof input === 'object'){
        let reader = new FileReader();

        reader.readAsText(input);
        
        reader.onload = function(val){
            callback(parse(this.result));
        }
    }
}


export default csv;