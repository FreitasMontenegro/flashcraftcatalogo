// script.js atualizado com ajustes solicitados
const itens = [
    {
        nome: "Vaso Moderno",
        preco: 30,
        altura: "15cm",
        categorias: ["Categoria 1", "Categoria 2"],
        colorido: true,
        relevancia: 9,
        img: "imgBase.png",
        id: "001",
    },
    {
        nome: "Boneco Geek",
        preco: 50,
        altura: "12cm",
        categorias: ["Categoria 3", "Categoria 5", "Categoria 1"],
        colorido: false,
        relevancia: 9,
        img: "imgBase.png",
        id: "002",
    },
    {
        nome: "Exército de Plástico",
        preco: 50,
        altura: "12cm",
        categorias: ["Categoria 3", "Categoria 5", "Categoria 1"],
        colorido: false,
        relevancia: 9,
        img: "imgBase.png",
        id: "003",
    },
    {
        nome: "Nome Personalizado",
        preco: 50,
        altura: "12cm",
        categorias: ["Categoria 3", "Categoria 5", "Categoria 1"],
        colorido: false,
        relevancia: 9,
        img: "imgBase.png",
        id: "004",
    },
    {
        nome: "Broche",
        preco: 50,
        altura: "12cm",
        categorias: ["Categoria 3", "Categoria 5", "Categoria 1"],
        colorido: false,
        relevancia: 9,
        img: "imgBase.png",
        id: "005",
    },
    {
        nome: "Mochila",
        preco: 50,
        altura: "12cm",
        categorias: ["Categoria 3", "Categoria 5", "Categoria 1"],
        colorido: false,
        relevancia: 9,
        img: "imgBase.png",
        id: "006",
    },
    {
        nome: "Clube de Regatas Flamengo",
        preco: 50,
        altura: "12cm",
        categorias: ["Categoria 3", "Categoria 5", "Categoria 1"],
        colorido: false,
        relevancia: 9,
        img: "Flamengo.png",
        id: "007",
    },
];

const likes = JSON.parse(localStorage.getItem("likes") || '{}');
const relevancias = JSON.parse(localStorage.getItem("relevancias") || '{}');

itens.forEach(item => {
    if (relevancias[item.id] != null) {
        item.relevancia = relevancias[item.id];
    }
});

const container = document.getElementById("itens");
const pesquisa = document.getElementById("pesquisa");
const ordenar = document.getElementById("ordenar");
const qtdItens = document.getElementById("qtdItens");
const checkboxes = document.querySelectorAll(".categorias input[type=checkbox]");

function salvarLikes() {
    localStorage.setItem("likes", JSON.stringify(likes));
}

function renderizarItens() {
    const textoPesquisa = pesquisa.value.toLowerCase();
    const categoriasSelecionadas = Array.from(checkboxes)
        .filter(c => c.checked)
        .map(c => c.nextElementSibling.innerText);

    let itensFiltrados = itens.filter(item => {
        const nomeCond = item.nome.toLowerCase().includes(textoPesquisa);
        const categoriaCond = categoriasSelecionadas.length === 0 ||
            categoriasSelecionadas.some(cat => item.categorias.includes(cat));
        return nomeCond && categoriaCond;
    });

    switch (ordenar.value) {
        case "precoMaior":
            itensFiltrados.sort((a, b) => b.preco - a.preco);
            break;
        case "precoMenor":
            itensFiltrados.sort((a, b) => a.preco - b.preco);
            break;
        case "alfabetica":
            itensFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        case "avaliacao":
            itensFiltrados.sort((a, b) => (likes[b.id] || 0) - (likes[a.id] || 0));
            break;
        case "relevancia":
        default:
            itensFiltrados.sort((a, b) =>
                (b.relevancia + (likes[b.id] || 0)) -
                (a.relevancia + (likes[a.id] || 0))
            );
            break;
    }

    container.innerHTML = "";
    itensFiltrados.forEach(item => {
        const curtidas = likes[item.id] || 0;
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
            <img src="${item.img}" alt="${item.nome}">
            <h4>${item.nome}</h4>
            <p><strong>Altura:</strong> ${item.altura}</p>
            <p><strong>Preço:</strong> R$ ${item.preco}</p>
            <p>${item.colorido ? "🌈 Colorido" : "⚪ Monocromático"}</p>
            <p>⭐ ${item.avaliacao || '9'}</p>
            <div class="curtir ${likes[item.id] ? 'curtido' : ''}" data-id="${item.id}">
                ${likes[item.id] ? '❤' : '♡'} <span>${curtidas}</span>
            </div>
        `;
        container.appendChild(div);
    });

    document.querySelectorAll(".curtir").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            likes[id] = likes[id] ? 0 : 1;
            salvarLikes();

            // Atualiza visual do coração apenas, sem reordenar
            btn.classList.toggle("curtido");
            const icone = likes[id] ? '❤' : '♡';
            btn.innerHTML = `${icone} <span>${likes[id]}</span>`;
        });
    });

    qtdItens.textContent = itensFiltrados.length;
}

pesquisa.addEventListener("input", renderizarItens);
ordenar.addEventListener("change", renderizarItens);
checkboxes.forEach(c => c.addEventListener("change", renderizarItens));

renderizarItens();

// Slideshow
let slideIndex = 0;
let timeout;
let paused = false;

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

slides.forEach(slide => {
    slide.style.position = 'absolute';
    slide.style.top = 0;
    slide.style.left = 0;
    slide.style.width = '100%';
    slide.style.height = '250px';
});

document.querySelector(".slideshow-container").style.height = '250px';

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove("active", "exit");
        if (i === index) {
            slide.classList.add("active");
        }
    });
    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
    slideIndex = index;
}

function nextSlide() {
    showSlide((slideIndex + 1) % slides.length);
}

function prevSlide() {
    showSlide((slideIndex - 1 + slides.length) % slides.length);
}

function autoSlide() {
    if (!paused) nextSlide();
    timeout = setTimeout(autoSlide, 5000);
}

dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        paused = true;
        showSlide(i);
        clearTimeout(timeout);
        setTimeout(() => paused = false, 10000);
    });
});

[nextBtn, prevBtn].forEach(btn => btn.addEventListener("click", e => {
    paused = true;
    btn === nextBtn ? nextSlide() : prevSlide();
    clearTimeout(timeout);
    setTimeout(() => paused = false, 10000);
}));

document.querySelector(".slideshow-container").addEventListener("mouseenter", () => paused = true);
document.querySelector(".slideshow-container").addEventListener("mouseleave", () => paused = false);

showSlide(slideIndex);
autoSlide();
