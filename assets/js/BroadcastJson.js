function SingIn() {
	const elements = document.querySelectorAll("#SignInForm input[name]");
	const param = {};

	elements.forEach(element => {
		param[element.name] = element.value;
	});

	const xhr = new XMLHttpRequest();
	xhr.open("POST", "/sign-in");
	xhr.onload = () => {
		if (xhr.status === 200) {
			window.location.href = "/index"
		} else {
			console.log(xhr.responseText);
			console.log(xhr.status);

		}
	}
	xhr.send(JSON.stringify(param));
}

const selectUser = document.querySelector("#SelectUser");
const analiseBlock = document.querySelector("#AnaliseBlock");

function GetUsers() {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", "/user");
	xhr.onload = () => {
		if (xhr.status === 200) {
			const users = JSON.parse(xhr.response);

			if (!selectUser) return;

			for (const user of users) {
				const option = document.createElement("option");
				option.value = user.id;
				option.text = user.last_name + " " + user.first_name + " " + user.patronymic + " " + user.snils;
				selectUser.options.add(option);
				selectUser.append(option);
			}
			selectUser.selectedIndex = -1;
			selectUser.onchange = OnChangeUser;
		} else {
			console.log(xhr.responseText);
		}
	}
	xhr.send();
}

function OnChangeUser() {
	if (!selectUser) return;

	const xhr = new XMLHttpRequest();
	xhr.open("GET", "/analyses/" + selectUser.value);
	xhr.onload = () => {
		if (xhr.status === 200) {
			const analyses = JSON.parse(xhr.response);

			if (!analiseBlock) return;
			analiseBlock.innerHTML = "";

			for (const analise of analyses) {
				const div = document.createElement("div");
				const divDate = document.createElement("div");
				const divPH = document.createElement("div");

				divDate.textContent = analise.date;
				divDate.className = "analise-date";

				divPH.textContent = analise.ph;

				div.append(divDate, divPH);

				analiseBlock.append(div);
			}
		} else {
			console.log(xhr.responseText);
		}
	}
	xhr.send();
}


GetUsers();