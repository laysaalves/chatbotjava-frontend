const contexto = [];

const chat = document.getElementById('chat');
const input = document.getElementById('input');

input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        enviarMensagem();
    }
});

function criaBolhaUsuario() {
    const div = document.createElement('div');
    div.className = 'message message-user';
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.innerText = getTimeString();
    div.appendChild(timeDiv);
    
    return div;
}

function criaBolhaBot() {
    const div = document.createElement('div');
    div.className = 'message message-bot';
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.innerText = getTimeString();
    div.appendChild(timeDiv);
    
    return div;
}

function getTimeString() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function vaiParaFinalDoChat() {
    chat.scrollTop = chat.scrollHeight;
}

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

    contexto.push(`Cliente: ${mensagem}`);
    
    try {
        const resposta = await fetch("http://localhost:8080/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 'userInput': mensagem,
                'context': contexto
             })
        });
        const textoDaResposta = await resposta.text();
        console.log(textoDaResposta);
        novaBolhaBot.innerHTML = textoDaResposta.replace(/\n/g, '<br>');
        
        contexto.push(`IA: ${textoDaResposta}`);              

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
