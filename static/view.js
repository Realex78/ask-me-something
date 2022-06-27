const button = document.getElementById("submitPassword")
const input = document.getElementById("password")
const form = document.getElementById("form")

button.addEventListener("click", async ev => {
	ev.preventDefault();
	const formData = new URLSearchParams(new FormData(form))
	const response = await fetch("./api/get", { method: "POST", body: formData })
	if (response.status == 401) {
		if (form.getElementsByTagName("div").length > 0) return;
		const element = document.createElement("div")
		element.append("La contraseña es incorrecta")
		element.classList = ["invalid-feedback"]
		element.id = "invalid-feedback"
		input.setAttribute("aria-describedby", "invalid-feedback")
		form.insertBefore(element, button)
		input.classList.add("is-invalid")
	} else if (response.status == 200) {
		form.remove()
		const container = document.createElement("div")
		const list = document.createElement("ul")
		const data = await response.json()
		data.forEach(object => {
			const element = document.createElement("li")
			element.append(object.content)
			list.appendChild(element)
		});
		const title = document.createElement("h2")
		title.append("Tus mensajes:")
		container.append(title, list)
		document.getElementById("card").appendChild(container)
	}
})