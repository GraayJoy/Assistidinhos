import force from "./force.js";
import { suggestions } from "./search.js";
import { appendMediaToDOM, updateMediaInDOM } from "./renderMedia.js";

const baseUrl = 'https://assistidinhos.onrender.com/api/assistidos';

async function getMedia() {
  try {
    const response = await fetch(baseUrl);
    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar assistidos:", err);
    return [];
  }
}

function addMedia(category) {
  const divAdd = document.querySelector(".addHere");
  divAdd.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.classList.add("addTrue");
  wrapper.innerHTML = `
  <h4>Adicione Aqui seu assistidinho</h4>
  <input type="text" class="inputAdd name" placeholder="Assistidinho">
  <div class="searchBox" style="display: none;"></div>
  <input type="text" class="inputAdd URLimage" placeholder="URL da Imagem">
`;

  const btns = document.createElement("div");
  const btnOk = document.createElement("button");
  btnOk.textContent = "Okay";
  btnOk.addEventListener("click", () => finish(category));

  const btnCancel = document.createElement("button");
  btnCancel.textContent = "Cancelar";
  btnCancel.addEventListener("click", force);

  btns.appendChild(btnOk);
  btns.appendChild(btnCancel);
  wrapper.appendChild(btns);

  divAdd.appendChild(wrapper);
  suggestions();
};

function editMedia(id) {
  const divEdit = document.querySelector(".editPost");
  divEdit.innerHTML = "";

  const box = document.querySelector(`.box[data-id="${id}"]`);
  if (!box) {
    alert("Item não encontrado no DOM.");
    return;
  }

  const image = box.querySelector("img").src;
  const name = box.querySelector("h2").textContent;

  const wrapper = document.createElement("div");
  wrapper.classList.add("addTrue", "addEdit");
  wrapper.innerHTML = `
    <h4>deseja editar seu assistidinho?</h4>
    <img src="${image}">
    <input type="text" class="inputAdd name" placeholder="Assistidinho" value="${name}">
    <div class="searchBox" style="display: none;"></div>
    <input type="text" class="inputAdd URLimage" placeholder="URL da Imagem" value="${image}">
  `;

  const btns = document.createElement("div");

  const btnOk = document.createElement("button");
  btnOk.textContent = "Okay";
  btnOk.addEventListener("click", () => putMedia(id));

  const btnDel = document.createElement("button");
  btnDel.textContent = "Deletar";
  btnDel.addEventListener("click", () => delMedia(id));

  const btnCancel = document.createElement("button");
  btnCancel.textContent = "Cancelar";
  btnCancel.addEventListener("click", () => {
    divEdit.innerHTML = "";
  });

  btns.append(btnOk, btnDel, btnCancel);
  wrapper.appendChild(btns);
  divEdit.appendChild(wrapper);

  suggestions();
}


async function putMedia(id) {
  const name = document.querySelector(".name").value;
  const image = document.querySelector(".URLimage").value;

  if (!name) return alert("Preencha todos os campos!");

  const medias = await getMedia();
  const media = medias.find((item) => item.id == id);
  if (!media) return alert("Item não encontrado.");

  const payload = {
    name,
    image: image || media.image,
    category: media.category,
  };

  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) return alert("Erro ao atualizar no Supabase");

  updateMediaInDOM(id, payload);
  force();
};

async function delMedia(id) {
  if (!confirm("Tem certeza que deseja deletar esse assistidinho?")) return;

  try {
    const response = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao deletar no Supabase");

    const box = document.querySelector(`.box[data-id="${id}"]`);
    if (box) box.remove();

    force();
    alert("Deletado com sucesso!");
  } catch (err) {
    console.error("Erro ao deletar no Supabase:", err);
    alert("Erro ao deletar mídia");
  }
};

async function updateCategory(id, novaCategoria) {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: novaCategoria })
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar categoria no Supabase");
    }
  } catch (err) {
    console.error("Erro ao mover mídia:", err);
  }
}


async function finish(category) {
  const name = document.querySelector(".name").value;
  const image = document.querySelector(".URLimage").value;

  if (!name || !image) return alert("Preencha todos os campos!");

  const payload = { name, image, category };
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Erro ao adicionar");
    const result = await response.json();
    appendMediaToDOM(result[0]);
    force();
  } catch (err) {
    console.error("Erro ao enviar:", err);
  }

};

export {finish, updateCategory, delMedia, putMedia, editMedia, addMedia, getMedia}