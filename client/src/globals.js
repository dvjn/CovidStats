const globals = {
  search: (name, arr) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].name === name) {
        return arr[i];
      }
    }
  },
  host: "https://covid19-stats.herokuapp.com",
  params: [
    { name: "Confirmed", color: "#007bff" },
    { name: "Deaths", color: "#dc3545" },
    { name: "Recovered", color: "#28a745" },
  ],
};

export default globals;
