

const Utils = {
  formatDate(d) {
    return [d.getFullYear(),
                  d.getDate(),
                 d.getMonth()+1].join('-')+' '+
                 [d.getHours(),
                  d.getMinutes(),
                  d.getSeconds()].join(':');
   },

importJsFile(file, async) {

    const script = document.createElement('script');
    script.src = file;
    script.async = async ===true? true:false;
    document.body.appendChild(script);
    return () => {
        document.body.removeChild(script);
    }
}

}


export default Utils;