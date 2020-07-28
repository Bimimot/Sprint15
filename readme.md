# Sprint 15 Project
### Version 1.0

Adress:
# sprint15.ml
# 130.193.38.80


# API
## Method	Adress			Body			Result
## GET 	 --> 	/users			-->	{} 			-->	список пользователей с полными данными
## GET 	 --> 	/users/{id}		-->	{} 			-->	данные пользователя с указанным id
## PATCH --> 	/me			-->	{me, about} 		-->	обновление данных в профиле пользователя
## PATCH --> 	/me/avatar		-->	{avatar} 		-->	обновление в профиле пользователя ссылки на аватар пользователя
## PUT 	 --> 	/signin			-->	{email, password} 	-->	авторизация
## PUT 	 --> 	/signup			-->	{name, about, avatar,email, password} 	-->	создание нового пользователя
## GET 	 --> 	/cards			-->	{} 			-->	список карточек с полными данными
## POST	 --> 	/cards			-->	{name, link}		-->	создание карточки
## DEL	 --> 	/cards/{cardID}		-->	{}			-->	удаление карточки
## PUT	 --> 	/cards/{cardID}/likes	-->	{}			--> добавление лайка для карточки
## DEL	 --> 	/cards/{cardID}/likes	-->	{}			--> снятие лайка для карточки

## It's training project
This project about backend-deploying to remote server
	
## Author - Stepan Popov
