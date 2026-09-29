const API = "https://ecommerce.fedegonzalez.com";

function GET (url){
    fetch (API+url)
}

function FICHA() {
    const ApiRopa = "https://ecommerce.fedegonzalez.com/products/1717";
    fetch(ApiRopa, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer 922',
            'accept': 'application/json'
        }
    })
        .then(Response => Response.json())
        .then(data => {
            const div = document.getElementById("CATE");
            div.innerHTML =
                "<h2>" + data.title + "</h2>" +
                "<p>" + data.description + "</p>" +
                "<p>" + data.price + "<p>" +
                '<img src="' + "https://ecommerce.fedegonzalez.com" + data.pictures[0] + '">';

            document.getElementsByClassName("")
            console.log(data)
        });
}
FICHA()

  