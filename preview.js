document.querySelector(".gerar").addEventListener("click", function () {
    // Abrir preview
    document.getElementById("preview-overlay").style.display = "flex";

    // Preencher nome
    document.getElementById("pv-nome").textContent =
        document.getElementById("nome").value || "Seu Nome Aqui";

    // Informações pessoais
    const idade = document.getElementById("idade").value;
    const sexo = document.getElementById("sexo").value;
    const civil = document.getElementById("civil").value;
    const nacionalidade = document.getElementById("nacionalidade").value;

    document.getElementById("pv-infos").textContent =
        `${idade} anos • ${sexo} • ${civil} • ${nacionalidade}`;

    // Objetivo
    document.getElementById("pv-objetivo").textContent =
        document.getElementById("objetivo").value;

    // Formação
    const formacao = document.querySelectorAll("section:nth-of-type(4) input");
    document.getElementById("pv-formacao").textContent =
        `${formacao[0].value} — ${formacao[1].value} (Conclusão: ${formacao[2].value})`;

    // Experiência
    const experiencia = document.querySelectorAll("section:nth-of-type(5) input, section:nth-of-type(5) textarea");
    document.getElementById("pv-experiencia").textContent =
        `${experiencia[0].value} — ${experiencia[1].value}\n${experiencia[2].value}`;

    // Qualificações
    document.getElementById("pv-qualificacoes").textContent =
        document.querySelector("section:nth-of-type(6) textarea").value;

    // Adicionais
    document.getElementById("pv-adicionais").textContent =
        document.querySelector("section:nth-of-type(7) textarea").value;
});

// Fechar preview
document.getElementById("fecharPreview").addEventListener("click", function () {
    document.getElementById("preview-overlay").style.display = "none";
});
