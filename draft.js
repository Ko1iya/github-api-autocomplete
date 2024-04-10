const url = "https://api.github.com/search/repositories?q="

const searchInput = document.getElementById("srh")
const resultList = document.getElementById("resultList")
const addlistRepo = document.getElementById("addlistRepo")
async function getResultSearch(param) {
  console.log("start")
  try {
    const response = await fetch(`${url}${param}`)
    if (!response.ok) {
      throw new Error(`ERRROR ${response.status}`)
    }
    const result = await response.json()
    return result
  } catch (error) {
    console.log("ERRROR")
  } finally {
    console.log("finally")
  }
}

function debounce(fn, ms) {
  let timeout
  return async function () {
    fn = await fn
    const fnCall = () => {
      fn.apply(this, arguments)
    }

    clearTimeout(timeout)

    timeout = setTimeout(fnCall, ms)
  }
}

async function render() {
  const input = searchInput.value.toLowerCase()
  let items
  resultList.innerHTML = ""
  resultList.style.display = "none"
  if (input) {
    items = await getResultSearch(input)
    resultList.innerHTML = ""
    resultList.style.display = "none"
  } else {
    return
  }

  if (items && items.items && items.items.length) {
    items = items.items.slice(0, 5)
  } else {
    return
  }
  if (input && items.length) {
    items.forEach((item) => {
      const div = document.createElement("div")
      div.textContent = item.name
      div.onclick = function addIt() {
        searchInput.value = ""
        resultList.innerHTML = ""
        resultList.style.display = "none"
        console.log(item)
        const itemAddlist = document.createElement("div")
        itemAddlist.className = "itemAddlist"
        itemAddlist.onclick = function () {
          itemAddlist.remove()
        }
        const itemAddlistName = document.createElement("p")
        itemAddlistName.textContent = `Name: ${item.name}`
        const itemAddlistOwner = document.createElement("p")
        itemAddlistOwner.textContent = `Owner: ${item.owner.login}`
        const itemAddlistStars = document.createElement("p")
        itemAddlistStars.textContent = `Stars: ${item.stargazers_count}`
        itemAddlist.appendChild(itemAddlistName)
        itemAddlist.appendChild(itemAddlistOwner)
        itemAddlist.appendChild(itemAddlistStars)
        addlistRepo.appendChild(itemAddlist)
      }

      resultList.appendChild(div)
      resultList.style.display = "block"
    })
  }
}
const fnWithDebounce = debounce(render, 400)

searchInput.addEventListener("input", fnWithDebounce)
