export let utils={
    calcAge:(dateString)=> {
        var birthday = +new Date(dateString);
        return ~~((Date.now() - birthday) / (31557600000));
      }
}
