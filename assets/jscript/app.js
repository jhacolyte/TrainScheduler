  // Your web app's Firebase configuration
  var firebaseConfig = {
      apiKey: "AIzaSyB0gg4VH5QceJrAebRlOUgH7QNaYvbyEfk",
      authDomain: "testtrain-214f3.firebaseapp.com",
      databaseURL: "https://testtrain-214f3.firebaseio.com",
      projectId: "testtrain-214f3",
      storageBucket: "",
      messagingSenderId: "684190125639",
      appId: "1:684190125639:web:68cd479753f1c529"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  var trainName = "";
  var destination = "";
  var startTime = "";
  var frequency = 0;



  function currentTime() {
      var current = moment().format('LT');
      console.log(current)
      $("#currentTime").html(current);
      setTimeout(currentTime, 1000);
  };

  $(".form-field").on("keyup", function() {
      var traintemp = $("#train-name").val().trim();
      var citytemp = $("#destination").val().trim();
      var timetemp = $("#first-train").val().trim();
      var freqtemp = $("#frequency").val().trim();


  });


  $(document).on("click", "#submit", function(event) {
      event.preventDefault();

      if ($("#train-name").val().trim() === "" ||
          $("#destination").val().trim() === "" ||
          $("#first-train").val().trim() === "" ||
          $("#frequency").val().trim() === "") {

          alert("Please fill in all details to add new train");

      } else {
          console.log('else')

          trainName = $("#train-name").val().trim();
          destination = $("#destination").val().trim();
          startTime = $("#first-train").val().trim();
          frequency = $("#frequency").val().trim();

          $(".form-field").val("");

          database.ref().push({
              trainName: trainName,
              destination: destination,
              frequency: frequency,
              startTime: startTime,
              dateAdded: firebase.database.ServerValue.TIMESTAMP
          });

          sessionStorage.clear();
      }

  });

  database.ref().on("child_added", function(childSnapshot) {
      var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
      var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
      var timeRemain = timeDiff % childSnapshot.val().frequency;
      var minToArrival = childSnapshot.val().frequency - timeRemain;
      var nextTrain = moment().add(minToArrival, "minutes");
      var key = childSnapshot.key;

      var newrow = $("<tr>");
      newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
      newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
      newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
      newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
      newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
      newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));

      if (minToArrival < 6) {
          newrow.addClass("info");
      }

      $("#train-table-rows").append(newrow);

  });

  $(document).on("click", ".arrival", function() {
      keyref = $(this).attr("data-key");
      database.ref().child(keyref).remove();
      window.location.reload();
  });

  currentTime();

  setInterval(function() {
      window.location.reload();
  }, 60000);