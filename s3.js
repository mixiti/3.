// 获取玩家信息，检查本地存储
function getPlayerInfo() {
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo"));
    if (playerInfo) {
        document.getElementById("player-nickname").innerText = `玩家昵称: ${playerInfo.nickname}`;
        document.getElementById("player-history").innerText = `游戏历史: ${playerInfo.history.join(' -> ')}`;
    } else {
        const defaultInfo = {
            nickname: "勇敢的冒险者",
            history: []
        };
        localStorage.setItem("playerInfo", JSON.stringify(defaultInfo));
        document.getElementById("player-nickname").innerText = `玩家昵称: ${defaultInfo.nickname}`;
        document.getElementById("player-history").innerText = `游戏历史: `;
    }
}

// 加载文本资料
async function loadTextFile(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`无法加载文件: ${file}`);
        const text = await response.text();
        return text;
    } catch (error) {
        console.error(error);
    }
}

class TreasureMap {
    static async getInitialClue() {
        const clue = await loadTextFile("texts/library.txt");
        document.getElementById("clue").innerHTML = `<p>${clue}</p><img src="images/library.jpg" alt="古老的图书馆">`;
        return clue;
    }

    static async decodeAncientScript(clue) {
        const script = await loadTextFile("texts/temple.txt");
        document.getElementById("location").innerHTML = `<p>${script}</p><img src="images/temple.jpg" alt="古老的神庙">`;
        return script;
    }

    static async searchTemple(location) {
        const random = Math.random();
        if (random < 0.5) {
            const guard = await loadTextFile("texts/guard.txt");
            document.getElementById("box").innerHTML = `<p>${guard}</p><img src="images/guard.gif" alt="神庙守卫">`;
            throw new Error(`糟糕!遇到了神庙守卫: ${guard}`);
        }
        const box = await loadTextFile("texts/box.txt");
        document.getElementById("box").innerHTML = `<p>${box}</p><img src="images/box.jpg" alt="神秘的箱子">`;
        return box;
    }

    static async solveMaze() {
        const maze = await loadTextFile("texts/maze.txt");
        document.getElementById("maze").innerHTML = `<p>${maze}</p><img src="images/maze.jpg" alt="古老的迷宫">`;
        return maze;
    }

    static async openTreasureBox() {
        const treasure = await loadTextFile("texts/treasure.txt");
        document.getElementById("treasure").innerHTML = `<p>${treasure}</p><img src="images/treasure.jpg" alt="传说中的宝藏">`;
        return treasure;
    }
}

async function findTreasureWithAsyncAwait() {
    try {
        const clue = await TreasureMap.getInitialClue();

        const location = await TreasureMap.decodeAncientScript(clue);

        try {
            const box = await TreasureMap.searchTemple(location);
        } catch (guardError) {
            updatePlayerHistory("遇到了守卫，游戏失败");
            return;
        }

        const mazeSolution = await TreasureMap.solveMaze();

        const treasure = await TreasureMap.openTreasureBox();
        updatePlayerHistory("成功找到了宝藏！");
    } catch (error) {
        console.error("任务失败:", error);
        updatePlayerHistory("游戏失败");
    }
}

// 更新玩家历史
function updatePlayerHistory(newHistory) {
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo"));
    playerInfo.history.push(newHistory);
    localStorage.setItem("playerInfo", JSON.stringify(playerInfo));
    document.getElementById("player-history").innerText = `游戏历史: ${playerInfo.history.join(' -> ')}`;
}

// 加载游戏时获取玩家信息
getPlayerInfo();

// 启动游戏
findTreasureWithAsyncAwait();
