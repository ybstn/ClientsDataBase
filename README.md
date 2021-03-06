# asp.net core + react web braid studio clients database

База данных клиентов брейд студии braidcode. Задача приложения - из нескольких аккаунтов мастеров добавлять/редактировать/удалять новых клиентов с фото, добавлять каждому клиенту записи с описанием и фото работы с помощью мобильного телефона или ноутбука. Преимущественно используется на мобильном ( оформление десктопной части не доработано). База данных - MySql, регистрация - JwtBearer, серверная часть - asp.net core, клиентская - react. 

Страница регистрации мастера:
<p align="center">
<img width="20%" src="images/LoginForm.png"/>
</p>

Главная страница со списком клиентов и кнопкой добавления нового клиента:
<p align="center">
<img width="20%" src="images/MainPage(SamsungA5).png"/>
</p>

Главная страница с выбранным клиентом и группой кнопок управления клиентом - кнопки добавления новой записи клиенту, редактирования клиента и удаления клиента:
<p align="center">
<img width="20%" src="images/MainPageSelectedUser(SamsungA5).png"/>
</p>

Форма добавления нового клиента с полями - фото, имя, телефон (для валидации номера телефона используется react-phone-number-input):
<p align="center">
<img width="20%" src="images/AddNewUserForm(SamsungA5).png"/>
</p>

Валидация формы добавления нового клиента (поле "имя" является обязательным):
<p align="center">
<img width="20%" src="images/AddNewUserFormValidation(SamsungA5).png"/>
</p>

Форма редактирования клиента (для редактирования и добавления используется одна и та же форма):
<p align="center">
<img width="20%" src="images/EditUserForm(SamsungA5).png"/>
</p>

Диалог удаления клиента:
<p align="center">
<img width="20%" src="images/DeleteUserDialogue(SamsungA5).png"/>
</p>

Страница со списком записей конкретного клиента:
<p align="center">
<img width="20%" src="images/UserRecordsPage(SamsungA5).png"/>
</p>

Страница со списком записей конкретного клиента с выбранной записью и открывшемся полем с кнопками управления записью:
<p align="center">
<img width="20%" src="images/UserRecordsPageSelectedRec(SamsungA5).png"/>
</p>

Форма добавления новой записи клиенту с полями - фото, дата, вид работы, стоимость работы, детали работы, комментарий:
<p align="center">
<img width="20%" src="images/UserRecordsAddNewForm(SamsungA5).png"/>
</p>

Валидация формы добавления новой записи клиенту (поля "вид работы" и "стоимость" являются обязательными):
<p align="center">
<img width="20%" src="images/UserRecordsAddNewFormValidation(SamsungA5).png"/>
</p>

Форма редактирования записи клиента (для редактирования и добавления используется одна и та же форма):
<p align="center">
<img width="20%" src="images/UserRecordsEditForm(SamsungA5).png"/>
</p>

Диалог удаления записи клиента:
<p align="center">
<img width="20%" src="images/UserRecordsDeleteRecordDialogue(SamsungA5).png"/>
</p>

Окно загрузки (приложение часто используется в зоне нестабильного интернет соединения). Для отображения спиннера загрузки используется react-promise-tracker:
<p align="center">
<img width="20%" src="images/LoadingSpinner(SamsungA5).png"/>
</p>
