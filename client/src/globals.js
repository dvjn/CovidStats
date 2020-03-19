const globals = {
  formatNumber: num => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  },
  search: (name, arr) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].name === name) {
        return arr[i];
      }
    }
  },
  host: "",
  // host: "http://localhost:5000",
  params: [
    { name: "Confirmed", color: "#007bff", longname: "Confirmed 💙" },
    { name: "Deaths", color: "#dc3545", longname: "Deaths 💔" },
    { name: "Recovered", color: "#28a745", longname: "Recovered 💚" },
  ],
};

export default globals;
