# asp.net core + react web braid studio clients database

База данных клиентов брейд студии braidcode. Задача приложения - из нескольких аккаунтов мастеров добавлять/редактировать/удалять новых клиентов с фото, добавлять каждому клиенту записи с описанием и фото работы с помощью мобильного телефона или ноутбука. Преимущественно используется на мобильном ( оформление десктопной части не доработано). База данных - MySql, регистрация - JwtBearer, серверная часть - asp.net core, клиентская - react. 

Страница регистрации мастера:

<img style="width:33%" src="images/LoginForm.png"/>

Главная страница со списком клиентов и кнопкой добавления нового клиента:

<img src="images/MainPage(SamsungA5).png"/>

Главная страница с выбранным клиентом и полем с кнопками управления клиентом (кнокпи добавления новой записи колиенту, редактирования клиента и удаления клиента):

<img src="images/MainPageSelectedUser(SamsungA5).png"/>

Форма добавления нового клиента с полями - фото, имя, телефон (для поля ввода и валидации номера телефона используется react-phone-number-input):

<img src="images/AddNewUserForm(SamsungA5).png"/>

Валидация формы добавления нового клиента (поле "имя" является обязательным):

<img src="images/AddNewUserFormValidation(SamsungA5).png"/>

Форма редактирования клиента (для редактирования и удаления используется одна и та же форма):

<img src="images/EditUserForm(SamsungA5).png"/>

Диалог удаления клиента:

<img src="images/DeleteUserDialogue(SamsungA5).png"/>

Страница со списком записей конкретного клиента:

<img src="images/UserRecordsPage(SamsungA5).png"/>

Страница со списком записей конкретного клиента с выбранной записью и открывшемся полем с кнопками управления записью:

<img src="images/UserRecordsPageSelectedRec(SamsungA5).png"/>

Форма добавления новой записи клиенту с полями - фото, дата, вид работы, стоимость работы, детали работы, комментарий:

<img src="images/UserRecordsAddNewForm(SamsungA5).png"/>

Валидация формы добавления новой записи клиенту (поля "вид работы" и "стоимость" являются обязательными):

<img src="images/UserRecordsAddNewFormValidation(SamsungA5).png"/>

Форма редактирования записи клиента (для редактирования и удаления используется одна и та же форма):

<img src="images/UserRecordsEditForm(SamsungA5).png"/>

Диалог удаления записи клиента:

<img src="images/UserRecordsDeleteRecordDialogue(SamsungA5).png"/>

Окно загрузки (приложение часто используется в зоне нестабильного инетернет соединения). Для отображения спиннера загрузки используется react-promise-tracker:

<img src="images/LoadingSpinner(SamsungA5).png"/>
