// ===============================
// ページ判定
// ===============================
const currentPage = window.location.pathname;

// ===============================
// Backボタン（MOREページ専用）
// ===============================
const backParams = new URLSearchParams(window.location.search);
const from = backParams.get("from");
const backBtn = document.getElementById("backBtn");

if (currentPage.includes("more") && backBtn) {
    if (from === "web-design") backBtn.href = "web-design.html";
    else if (from === "management") backBtn.href = "management.html";
    else backBtn.href = "home.html";
}

// ===============================
// フィルターダイアログ（MOREページ専用）
// ===============================
if (currentPage.includes("more")) {
    const dialog = document.getElementById("filterDialog");
    const toggle = document.querySelector(".filter-toggle");
    const closeBtn = document.querySelector(".close-dialog");

    if (toggle && dialog && closeBtn) {
        toggle.addEventListener("click", () => dialog.style.display = "flex");
        closeBtn.addEventListener("click", () => dialog.style.display = "none");

        dialog.addEventListener("click", (e) => {
            if (e.target === dialog) dialog.style.display = "none";
        });
    }
}

// ===============================
// JSONから作品データを読み込む
// ===============================
fetch("./json/works.json")
    .then(res => res.json())
    .then(works => {

        // ===============================
        // 新着抽出
        // ===============================
        const webNew = works.filter(w => w.category === "web" && w.isNew).slice(0, 2);
        const mgtNew = works.filter(w => w.category === "management" && w.isNew).slice(0, 2);

        // ===============================
        // 新着表示（★ ComingSoon 対応版）
        // ===============================
        function renderNewWorks(list) {
            const firstContent = document.querySelector(".new-content-first");
            const secondContent = document.querySelector(".new-content-second");

            if (!firstContent || !secondContent) return;

            // 1つ目
            if (list[0]) {
                if (!list[0].url || list[0].url === "") {
                    firstContent.innerHTML = `
                        <div class="coming-soon">
                            <img src="${list[0].img}" alt="Coming Soon">
                        </div>
                    `;
                    firstContent.onclick = () => {
                        alert("現在準備中です。公開までお待ちください！");
                    };
                } else {
                    firstContent.innerHTML = `
                        <a href="${list[0].url}" target="_blank">
                            <img src="${list[0].img}" alt="${list[0].title}">
                            <p>${list[0].title}</p>
                        </a>
                    `;
                }
            }

            // 2つ目
            if (list[1]) {
                if (!list[1].url || list[1].url === "") {
                    secondContent.innerHTML = `
                        <div class="coming-soon">
                            <img src="${list[1].img}" alt="Coming Soon">
                        </div>
                    `;
                    secondContent.onclick = () => {
                        alert("現在準備中です。公開までお待ちください！");
                    };
                } else {
                    secondContent.innerHTML = `
                        <a href="${list[1].url}" target="_blank">
                            <img src="${list[1].img}" alt="${list[1].title}">
                            <p>${list[1].title}</p>
                        </a>
                    `;
                }
            }
        }

        if (currentPage.includes("web-design")) {
            renderNewWorks(webNew);
        }

        if (currentPage.includes("management")) {
            renderNewWorks(mgtNew);
        }

        // ===============================
        // MOREページ：作品一覧生成
        // ===============================
        if (currentPage.includes("more")) {

            const params = new URLSearchParams(window.location.search);
            const mainFilter = params.get("filter");
            const moreList = works.filter(w => w.category === mainFilter);
            const container = document.querySelector(".work-list");

            moreList.forEach(work => {
                const item = document.createElement("div");
                item.className = "work-item";
                item.dataset.category = work.category;
                item.dataset.type = work.type;

                // ★ ComingSoon 判定
                if (!work.url || work.url === "") {
                    item.innerHTML = `
                        <div class="coming-soon">
                            <img src="${work.img}" alt="Coming Soon" style="margin-top: 40px;">
                        </div>
                    `;
                    item.onclick = () => {
                        alert("現在準備中です。公開までお待ちください！");
                    };
                } else {
                    item.innerHTML = `
                        <a href="${work.url}" target="_blank">
                            <img src="${work.img}" alt="${work.title}" style="margin-top: 40px;">
                            <p class="work-title">${work.title}</p>
                        </a>
                    `;
                }

                container.appendChild(item);
            });

            // ===============================
            // フィルターの種類をページごとに切り替える
            // ===============================
            const webBtns = document.querySelectorAll(".filter-btn.web");
            const mgtBtns = document.querySelectorAll(".filter-btn.mgt");

            if (mainFilter === "web") {
                webBtns.forEach(btn => btn.style.display = "flex");
                mgtBtns.forEach(btn => btn.style.display = "none");
            } else {
                webBtns.forEach(btn => btn.style.display = "none");
                mgtBtns.forEach(btn => btn.style.display = "flex");
            }

            // ===============================
            // フィルターのチェック処理
            // ===============================
            const filterBtns = document.querySelectorAll(".filter-btn");

            filterBtns.forEach(btn => {
                btn.addEventListener("click", () => {
                    btn.classList.toggle("active");
                });
            });

            // ===============================
            // 絞り込み検索処理
            // ===============================
            const searchBtn = document.querySelector(".search-btn");
            const dialog = document.getElementById("filterDialog");

            searchBtn.addEventListener("click", () => {

                const checkedTypes = [...document.querySelectorAll(".filter-btn.active")]
                    .map(btn => btn.dataset.type);

                const items = document.querySelectorAll(".work-item");

                if (checkedTypes.length === 0) {
                    items.forEach(item => {
                        item.style.display = (item.dataset.category === mainFilter) ? "block" : "none";
                    });
                    dialog.style.display = "none";
                    return;
                }

                items.forEach(item => {
                    const matchCategory = item.dataset.category === mainFilter;
                    const matchType = checkedTypes.includes(item.dataset.type);
                    item.style.display = (matchCategory && matchType) ? "block" : "none";
                });

                dialog.style.display = "none";
            });
        }
    });
