	const mySwiper = new Swiper(".swiper-container", {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: ".slider-button-next",
		prevEl: ".slider-button-prev",
	},
	});

	//cart
	const buttonCart = document.querySelector(".button-cart");
	const modalCart = document.querySelector("#modal-cart");
	//goods
	const viewAll = document.querySelectorAll(".view-all");
	const navigationLink = document.querySelectorAll(
	".navigation-link:not(.view-all)"
	);
	const longGoodsList = document.querySelector(".long-goods-list");
	const showClothing = document.querySelectorAll('.show-clothing');
	const showAcsessories = document.querySelectorAll('.show-acsessories');
	const cartTableGoods = document.querySelector('.cart-table__goods');
	const cardTableTotal = document.querySelector('.card-table__total');



	const getGoods = async () => {
	const result = await fetch("db/db.json");
	if (!result.ok) {
		throw "Error" + result.status;
	}
	return await result.json();
	};

	const cart = {
	cartGoods: [
		{
		id:"099",
		name:"watches",
		price: 999,
		count: 2,
		},
		{
		id:"090",
		name:"pipa",
		price: 1,
		count: 300,
		}
	],
	renderCart(){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({id,name,price,count}) =>{
		const trGood = document.createElement('tr');
		trGood.className = 'cart-item';
		trGood.dataset.id = id;

		trGood.innerHTML = `
			<td>${name}</td>
			<td>${price}</td>
			<td><button class="cart-btn-minus">-</button></td>
			<td>${count}</td>
			<td><button class="cart-btn-plus">+</button></td>
			<td>${price*count}</td>
			<td><button class="cart-btn-delete">x</button></td>
		`;
		cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce((sum,item) => {
				return sum + item.price * item.count;
		},0)

	cardTableTotal.textContent = totalPrice + '$'

	},
	deleteGood(id){
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},
	minusGood(id) {
		for (const item of this.cartGoods) {
			if(item.id === id) {
				if (item.count <= 1){
					this.deleteGood(id);
				} else {
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
	},
	plusGood(id) {
		for (const item of this.cartGoods) {
			if(item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCart();
	},
	addCardGoods(id){
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item =>item.id === id))
				.then(({id, name, price}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
				});
		}
		},
	}
	
	document.body.addEventListener('click',event =>{
		const addToCart = event.target.closest('.add-to-cart');
		console.log(addToCart);

		if(addToCart){
			console.log(addToCart.dataset.id);
			console.log(addToCart.dataset);
			cart.addCardGoods(addToCart.dataset.id)
		}
	})

	cartTableGoods.addEventListener('click',event =>{
		const target = event.target;
		if (target.classList.contains('cart-btn-delete')){
			const parent = target.closest('.cart-item');
			cart.deleteGood(parent.dataset.id);
		};
		if (target.classList.contains('cart-btn-minus')) {
			const parent = target.closest('.cart-item');
			cart.minusGood(parent.dataset.id);
		}
		if (target.classList.contains('cart-btn-plus')) {
			const parent = target.closest('.cart-item');
			cart.plusGood(parent.dataset.id);
		}
	})


	const openModal = () => {
	modalCart.classList.add("show");
	cart.renderCart();
	};
	const closeModal = () => {
	modalCart.classList.remove("show");
	};

	buttonCart.addEventListener("click", openModal);
	modalCart.addEventListener("click", (event) => {
	const target = event.target;
	if (
		target.classList.contains("overlay") ||
		target.classList.contains("modal-close")
	) {
		closeModal();
	}
	});

	//scroll-smooth
	{
	const scrollLinks = document.querySelectorAll("a.scroll-link");

	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener("click", event => {
		event.preventDefault();
		const id = scrollLink.getAttribute("href");
		document.querySelector(id).scrollIntoView({
			behavior: "smooth",
			block: "start",
			})
		});
	}
	}	


	const createCard = objCard => {
	const card = document.createElement("div");
	card.className = "col-l g-3 col-sm-6";
	card.innerHTML = `
		<div class="goods-card">
	${objCard.label ? `<span class="label">${objCard.label}</span>` : ""}
		<img src="db/${objCard.img}" alt="${objCard.name}" class="goods-image">
			<h3 class="goods-title">${objCard.name}</h3>
			<p class="goods-description">${objCard.description} </p>
			<button class="button goods-card-btn add-to-cart" data-id="${objCard.id}">
				<span class="button-price">$${objCard.price}</span>
		</button>
	</div>`;
	return card;
	};

	const renderCards = data => {
	longGoodsList.textContent = "";
	const cards = data.map(createCard);
	longGoodsList.append(...cards);
	document.body.classList.add("show-goods");
	};

	const showAll = event => {
	event.preventDefault();
	getGoods().then(renderCards);
	};

	viewAll.forEach(elem => {
	elem.addEventListener("click", event => {
		event.preventDefault();
		getGoods().then(renderCards);
	});
	});

	const filterCards = (field, value) => {
	getGoods()
		.then(data => data.filter(good => good[field] === value))
		.then(renderCards);
	};

	navigationLink.forEach(link => {
	link.addEventListener("click", event => {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	});
	});


	showClothing.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category', 'Clothing');
	});
	});

	showAcsessories.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category', 'Acsessories');
	});
	});
