
var Main = new Vue({
	el: '#main-app',
	data: {
		siteState: 'reg',
		teams: [],
		gotTeams: 0,
		regUserWaiting: false,
		regGamerTagError: "",
		regNameError: "",
		regGamerTagAlreadyUsed: 2,
		regTeamWaiting: false,
		gotPlayers: 0,
		players: [],
		regTeamNameError: "",
		regTeamLeaderNameError: ""
	}
	,
	methods: {
		
		siteStateChange : function(val) {
			if ( val == 'teams' && this.gotTeams == 0 ) {
				getTeams();
				this.gotTeams = 1;
			}
			if ( val == 'plrs' && this.gotPlayers == 0 ) {
				getPlayers();
				this.gotPlayers = 1;
			}
			this.siteState = val;
		},

		getTabClass: function(val) {
			if ( val == this.siteState ) {
				return "tab waves-effect waves-light " + "active";
			} else {
				return "tab waves-effect waves-light";
			}
		},

		verifyUserName: function() {
			var uname = this.$refs.userName.value;
			if ( (uname == "" || uname == null) ) {
				this.$refs.userName.attributes.class.value = "invalid";
				this.regNameError = "Enter a Name";
			} else {
				this.$refs.userName.attributes.class.value = "valid";
				this.regNameError = "Nice!"
			}
		},

		verifyGamerTag: function() {
			var gtag = this.$refs.regGamerTagRef;
			var instance = this;
			if ( (gtag.value == "" || gtag.value == null) ) {
				// Check if username is empty
				gtag.attributes.class.value = "invalid";
				this.regGamerTagError = "Enter a Gamer Tag";
			} else {
				// Fetch the username: 
				fetch('/users/checkusername/', {
					method: "POST",
					headers: {
						"Content-Type": "application/json; charset=utf-8"
					},
					body: JSON.stringify({"name": gtag.value})
				})
				.then(function(response) {
					response.json().then(function(data) {
						if ( data.presence ) {
							// Username already used.
							gtag.attributes.class.value = "invalid";
							instance.regGamerTagError = "Gamer Tag Already used";
						} else {
							// No problem
							gtag.attributes.class.value = "valid";
							instance.regGamerTagError = "Good to go!";
						}
					});
				}).catch(function(err) {
					console.log(err);
				});
			}
		},

		regFormSubmit: function() {
			this.regUserWaiting = !this.regUserWaiting;
			this.verifyUserName();
			this.verifyGamerTag();
			this.regUserWaiting = !this.regUserWaiting;
		}, 

		verifyRegTeamForm: function() {
			var teamName = this.$refs.teamName;
			var regTeamLeaderName = this.$refs.teamLeaderName;

			if ( teamName.value == "" || teamName.value == null ) {
				this.regTeamNameError = "Enter a team name.";
				teamName.attributes.class.value = "invalid";
			} else {
				this.regTeamNameError = "";
				teamName.attributes.class.value = "valid";
			}

			if ( teamLeaderName.value == "" || teamLeaderName.value == null ) {
				this.regTeamLeaderNameError = "Enter team leader name.";
				teamLeaderName.attributes.class.value = "invalid";
			} else {
				this.regTeamLeaderNameError = "";
				teamLeaderName.attributes.class.value = "valid";
			}

		}, 

		regTeamFormSubmit: function() {
			this.regTeamWaiting = !this.regTeamWaiting;
			this.verifyRegTeamForm();
			if ( this.regTeamNameError == this.regTeamLeaderNameError ) {
				// Both errors are empty, thus form is good to submit
				fetch('/teams/team_register/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						"id": 0,
						"team_name": this.$refs.teamName.value,
						"leader": this.$refs.teamLeaderName.value,
						"member": "To be auctioned.",
						"membertag": "-",
						"member2": "To be auctioned.",
						"member2tag": "-",
						"member3": "To be auctioned.",
						"member3tag": "-",
						"member4": "To be auctioned.",
						"member4tag": "-",
						"member5": "To be auctioned.",
						"member5tag": "-",
					})
				}).then(function(response) {
					console.log(response);
				}).catch(function(err) {
					console.log(err);
				});
			}
			this.regTeamWaiting = !this.regTeamWaiting;
		}
	}
});


// Gets all the teams from the server
var getTeams = function () {
	fetch("/teams/showteams/", {
		mode: 'no-cors'
	}).then(function(res) {
		res.json().then(function(data) {
			Main.teams = data;
		});
	}).catch(function(err) {
		console.log(err);
	});
}

// Get the list of players
var getPlayers = function () {
	fetch("players.json", {
		mode: 'no-cors'
	}).then(function(res) {
		res.json().then(function(data) {
			Main.players = data.players;
		});
	}).catch(function(err) {
		console.log(err);
	});
}