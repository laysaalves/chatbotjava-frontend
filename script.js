const contexto = [];

async function enviarMensagem() {
    if(input.value == "" || input.value == null) return;
    let mensagem = input.value;
    input.value = "";

    let novaBolha = criaBolhaUsuario();
    novaBolha.innerHTML = mensagem;
    chat.appendChild(novaBolha);

    let novaBolhaBot = criaBolhaBot();
    chat.appendChild(novaBolhaBot);
    vaiParaFinalDoChat();
    
    novaBolhaBot.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    try {
        contexto.push(`Cliente: ${mensagem}`);

        const resposta = await fetch("http://localhost:8080/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userInput: mensagem,
                context: contexto
            })
        });

        const textoDaResposta = await resposta.text();
        contexto.push(`IA: ${textoDaResposta}`);

        novaBolhaBot.innerHTML = textoDaResposta.replace(/\n/g, '<br>');
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.innerText = getTimeString();
        novaBolhaBot.appendChild(timeDiv);
    } catch (error) {
        novaBolhaBot.innerHTML = "Desculpe, ocorreu um erro ao processar sua mensagem.";
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.innerText = getTimeString();
        novaBolhaBot.appendChild(timeDiv);
        console.error("Erro:", error);
    }

    vaiParaFinalDoChat();
}
