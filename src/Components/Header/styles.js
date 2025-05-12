import styled from "styled-components";

export const Header = styled.div`
header {
    width: 100%;
    height: 120px;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #0c248b;
    z-index: 100;
}

.formMenu {
    position: absolute;
    max-width: 500px;
    right: 0;
    top: 120px;
    background: white;
    padding: 5px;
}

.menu {
    position: relative;
    height: 100%;
}

.menu__logo {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
}

.menu__navigation {
    height: 100%;
    float: right;
    margin-left: auto;
    white-space: nowrap;
}

.menu__items {
    float: left;
    display: block;
    height: 100%;
    display: flex;
    align-items: center;
}

header .menu__items {
    margin-left: 30px;
}

/*.menu__items + .menu__items {
	margin-left: 130px;
}*/
.menu__controls {
    float: left;
    height: 100%;
    margin-left: 15px;
}

.menu__item {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    float: left;
}

.menu__item+.menu__item {
    margin-left: 20px;
}

.menu__link--register {
    margin-left: 15px;
    padding: 12px 45px;
    border: 2px solid white;
    border-radius: 10px;
    text-transform: uppercase;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
    background-color: #ea5231;
    font-weight: 700 !important;
    transition: ease-in-out 0.3s;
}

.menu__link--register:hover {
    transform: scale(1.1);
}

.menuSair {
    font-size: 18px;
    display: flex;
    width: 100%;
    max-width: 150px;
    height: 40px;
    border: 0px;
    background-color: #0c248b;
    margin: 0px auto;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
}

.menu__link {
    font-size: 1.55em;
    font-weight: 500;
}

.menu__link::after {
    content: " ";
    display: block;
    width: 100%;
    height: 0px;
    background-color: transparent;
    margin-bottom: 0px;
    -webkit-transition: all .25s ease-out;
    -moz-transition: all .25s ease-out;
    transition: all .25s ease-out;
}

.menu__link:hover::after {
    background-color: white;
    height: 3px;
    margin-bottom: -3px;
}

.menu__link:hover::after .menu__link--active::after {
    background-color: white;
    height: 3px;
    margin-bottom: -3px;
}

.menu__link--register:hover::after {
    background-color: transparent !important;
    height: 3px;
    margin-bottom: -3px;
}

.menu__link--login {
    padding: 12px 18px;
    border: 2px solid white;
    border-radius: 10px;
    text-transform: uppercase;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
    position: relative;
    font-weight: 700 !important;
    transition: ease-in-out 0.3s;
}

.menuEntrar:hover {
    background-color: #00A7FF;
    transform: scale(1.1);
}

.menuEntrar::before {
    content: '';
    position: absolute;
    left: 15px;
    /* background-image: url("../img/user.png"); */
    height: 20px;
    background-size: contain;
    top: 50%;
    width: 50px;
    background-repeat: no-repeat;
    transform: translate(-0%, -50%);
}

.menuEntrar span {
    margin-left: 30px;
}

.menu__link--login::after {
    background-color: transparent !important;
}

/* .menu__link--login::after {
	content: " ";
	display: block;
	position: absolute;
	height: 0;
	width: 100%;
	bottom: 0;
	left: 0;
	background-color: #cd4200;
}
.menu__link--login:hover::after {
	content: " ";
	display: block;
	position: absolute;
	height: 100%;
	width: 100%;
	bottom: 0;
	left: 0;
	margin-bottom: 0;
	background-color: #cd4200;
} */
.menu__link--login span {
    z-index: 10;
}

/*.menu__link--register {
	color: #c675f3;
}*/

.btnParticipe {}

.btnEntrar {}

@media only screen and (max-width: 1460px) and (min-width: 861px) {
    body {
        padding-top: 80px;
    }


    /*.menu__items + .menu__items {
		margin-left: 30px;
	}*/
    .menu__item+.menu__item {
        margin-left: 25px;
    }

    .menu__item--register {
        margin-left: 13px !important;
    }

    .menu__controls {
        margin-left: 13px;
    }

}

@media only screen and (max-width: 1024px) and (min-width: 861px) {
    .menu__item+.menu__item {
        margin-left: 15px;
    }

    .menu__link {
        font-size: 1.4em;
    }

    .menu__controls {
        margin-left: 8px;
    }
}

@media only screen and (max-width: 860px) {
    body {
        padding-top: 80px;
    }


}

`;

