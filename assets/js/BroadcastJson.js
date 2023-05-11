const btmEnt = document.querySelector('#btmEnter');
btmEnt.onclick = SingIn;

function SingIn() {
	const elements = document.querySelectorAll("#SignInForm input[name]");
	const label = document.querySelector("#SignInForm label");
	const errorMessage = document.querySelector("#error-message");

	const inName = document.querySelector('#inputUserPass');
	const inLog = document.querySelector('#inputUserName');

	btmEnt.onclick = () => {
		if (inName.value.trim() === '' || inLog.value.trim() === '')
		{
			errorMessage.textContent = 'Необходимо заполнить все поля';
			console.log('Inputs is null');
		}
		else if (xhr.status === 403)
		{
			errorMessage.textContent = '';
			errorMessage.textContent = 'неверный логин/пароль';

		}
		else
		{
		}
		btmEnt.onclick = SingIn;
	};

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
	errorMessage.textContent = '';
	inName.textContent = '';
	inLog.textContent = '';
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