

const Utils = {
  formatDate(d) {
    return [d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()].join('-') + ' ' +
      [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
  },
  formatDateWithoutTime(d) {
    return [d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()].join('-');
  },
  convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}:00`;
  },

  customBackGround(append) {
    if (append) {
      document.body.style.backgroundImage = "url('/lcd/bak.jpg')";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "100% 100%";

    } else { 
      document.body.style.backgroundImage = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundSize = "";

    }

  },
  
importJsFile(file, async) {

    const script = document.createElement('script');
    script.src = file;
    script.async = async === true ? true : false;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }

}


export default Utils;