let current = 1;
let perpage = 6;
let totalrepo = 0;

function fetchUser() {
    fetch("https://api.github.com/users/guramrit2002")
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((data) => {
            userSection(data);
            totalrepo += data.public_repos;
            updatePagination();
        });
}

async function fetchRepositories() {
    try {
        const response = await fetch(
            `https://api.github.com/users/guramrit2002/repos?page=${current}&per_page=${perpage}`
        );

        if (!response.ok) {
            throw new Error("Error fetching repository data");
        }

        const data = await response.json();
        if (data.length > 0) {
            totalrepo += data.length;
            repositorySection(data);
        } else {
            // If the fetched data is empty, it means there are no more repositories.
            // You may want to handle this case, e.g., by disabling the "Load More" button.
            console.log('No more repositories to fetch.');
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function loadPage(num) {
    console.log(num)
    current += num;
    fetchRepositories();
}

function loadPagePagination(num) {
    const newPage = num;

    // Check if the new page is within bounds
    if (newPage >= 1 && newPage <= Math.ceil(totalrepo / perpage)) {
        current = newPage;
        fetchRepositories();
    } else {
        console.log('Invalid page number');
    }
}

function updatePagination() {
    const totalPages = Math.ceil(totalrepo / perpage);
    const paginationElement = document.getElementById("pagination");

    const links = Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const link = document.createElement("span");
        link.textContent = page;
        link.className = `pagination-link`;
        if (page === current) {
            link.classList.add("active");
            console.log(`Active page: ${page}`);
        }
        link.onclick = () => loadPagePagination(page);
        return link;
    });

    paginationElement.innerHTML = "";
    paginationElement.append(...links);
}

function userSection(data) {
    const userBioElement = document.getElementById("user-bio");
    userBioElement.innerHTML = `
        <div class="data">
            <div class="image">
            <div class='image2'>
                <img src="${data.avatar_url}" alt="${data.name}">
            </div>
            </div>
            <div class="data-main">
                <h1>${data.name}</h1>
                <p>${data.bio}</p>
                <p><span class="ai-location"></span> <i class="fa fa-map-marker"></i> ${data.location
        }</p>
                <p class="twitter"><strong>Twitter:</strong><a href="${data.twitter
        }">${data.twitter}</a></p>
                <p class="G 	itHub"><strong>GitHub:</strong><a href="${data.html_url
        }">${data.html_url}</a></p>
            </div>
        </div>
    `;
}

function repositorySection(data) {
    const userRepositoriesElement = document.getElementById("userRepositories");

    const mapArray = Array.isArray(data) ? data : [];
    const repo = mapArray
        .map(
            (repo) => {
                const topicsArray = Array.isArray(repo.topics) ? repo.topics : [];
                const validTopics = topicsArray.filter((topic) => topic);
                const topicsHtml = validTopics.map((topic) => `<p>${topic}</p>`).join("");
                console.log(topicsHtml || 'nothing')
                return `<div class="repository"><h1>${repo.name}</h1>
                <p>${repo.description || "no description available"}</p>
                <div class="buttons-repository-card">
                    ${topicsHtml || "no topics are specified"}
                </div></div>`
            }
        )
        .join("");

    userRepositoriesElement.innerHTML = `
            ${repo}
    `;
}

fetchUser();
fetchRepositories();
