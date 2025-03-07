# PlainDesk v2

## Обзор проекта

PlainDesk — это интерактивная персонализируемая доска с виджетами, которая позволяет организовать ваше рабочее пространство по вашему усмотрению. Пользователи могут перетаскивать различные виджеты на доску, настраивать их и сохранять текущее состояние.


## Функциональность

- **Интерактивная доска** с сеткой для размещения виджетов
- **Drag-and-Drop** функциональность для виджетов
- **Система виджетов** с возможностью легкого расширения
- **Сохранение состояния** в localStorage браузера с возомжностью подключения nosql базы данных
- **Светлая и темная темы** с минималистичным дизайном
- **Настройки пользователя** и управление аккаунтом
- **Адаптивный дизайн** не требуется, только web версия

## План разработки версий

### Версия 0.1.0 - MVP (Минимально жизнеспособный продукт)
- Базовая структура проекта и настройка окружения
- Простая доска с сеткой без виджетов
- Базовый UI с минималистичным дизайном
- Настройка роутинга с использованием Next.js

### Версия 0.2.0 - Базовая функциональность виджетов
- Базовый шаблон виджета (widget-template)
- Механизм добавления виджетов на доску
- Полная функциональность Drag & Drop
- Изменение размеров виджетов
- Удаление виджетов
- Панель элементов управления виджетами при наведении
- Базовые настройки для виджетов

### Версия 0.3.0 - Специализированные виджеты
- Первые 3 базовых виджета:
  - Календарь с отображением текущей даты
  - Часы с текущим временем
  - Простой список задач (Todo)
- Улучшение базового шаблона виджетов
- Специфические настройки для каждого виджета

### Версия 0.4.0 - Сохранение состояния
- Сохранение состояния доски в localStorage
- Сохранение расположения и размеров виджетов
- Сохранение настроек виджетов
- Автоматическое восстановление состояния при загрузке страницы

### Версия 0.5.0 - Настройки и темы
- Светлая и темная темы
- Переключение между темами
- Определение системных предпочтений темы через Media Queries API
- Настройки пользовательского интерфейса

### Версия 0.6.0 - Расширение системы виджетов
- Добавление еще 3-5 новых виджетов:
  - Погода
  - Заметки
  - Таймер/секундомер
  - Календарь событий
  - RSS-лента
- Улучшение базового шаблона виджетов
- Динамический импорт виджетов

### Версия 0.7.0 - Управление аккаунтом
- Регистрация и авторизация пользователей
- Профиль пользователя
- Основы системы сохранения настроек в облаке
- Подготовка к интеграции с NoSQL базой данных

### Версия 0.8.0 - Облачное хранение
- Интеграция с NoSQL базой данных
- Синхронизация между устройствами
- Резервное копирование настроек
- Возможность создания нескольких досок

### Версия 0.9.0 - Оптимизация и улучшения
- Оптимизация производительности
- Улучшение UX/UI
- Анимации и переходы с использованием Framer Motion
- Расширенные настройки виджетов

### Версия 1.0.0 - Релиз
- Финальное тестирование
- Исправление багов
- Документация для разработчиков виджетов
- Готовый к использованию продукт

### Версия 1.1.0+ - Будущие улучшения
- API для сторонних разработчиков виджетов
- Галерея виджетов сообщества
- Интеграции с внешними сервисами
- Расширенная аналитика использования доски

## Технический стек

1. **React** - основная библиотека для построения пользовательского интерфейса
2. **Next.js** - фреймворк для React с функциями серверного рендеринга и маршрутизации
3. **TypeScript** - типизированный суперсет JavaScript для более надежного кода
4. **Tailwind CSS** - утилитарный CSS-фреймворк для стилизации компонентов
5. **React DnD (Drag and Drop)** - библиотека для реализации функциональности перетаскивания виджетов
6. **Lucide React** - библиотека иконок для пользовательского интерфейса
7. **Framer Motion** - библиотека для создания анимаций в React-приложениях
8. **localStorage API** - для сохранения данных пользователя в браузере 
9. **Fetch API** - для выполнения HTTP-запросов к внешним API 
10. **CSS Grid и Flexbox** - для создания адаптивных макетов
11. **CSS Transitions и Animations** - для плавных переходов между состояниями интерфейса
12. **CSS Variables** - для управления темами (светлая/темная)
13. **Media Queries API** - для определения предпочтений пользователя по теме

## Архитектура

### Система виджетов

PlainDesk использует модульную систему виджетов, которая позволяет легко расширять функциональность доски:

- Все виджеты хранятся в одной директории (`widgets/`)
- Каждый виджет наследуется от базового класса/компонента (`widget-template`)
- Базовый класс обеспечивает:
  - Управление состоянием виджета и сохранение состояния при изменении
  - Обработку конфигурации и настроек
  - Рендеринг пользовательского интерфейса
  - Специфическую для виджета функциональность
  - Обработку скриптов виджета (опционально)
- Меню добавления виджетов автоматически получает список доступных виджетов через динамический импорт
- Приложение взаимодействует с виджетами через общий интерфейс базового класса, что обеспечивает гибкость и простоту добавления новых виджетов без модификации основной логики приложения

### Главные компоненты

- **Доска** - основной контейнер, который содержит сетку и виджеты
- **Заголовок** - содержит элементы управления доской и настройки
- **Сетка** - область для размещения виджетов
- **Виджеты** - отдельные функциональные блоки, которые можно размещать на доске

### Дизайн и поведение виджетов

#### Внешний вид
- **Минималистичный дизайн** - чистый интерфейс без лишних элементов
- **Скругленные края** для всех виджетов
- **Аккуратное размещение** строго по сетке, тень справа и снизу очень лёгкая
- **Акцентный цвет** - #A855F7 (фиолетовый) используется для кнопок, активных элементов и выделения


#### Элементы управления
Каждый виджет имеет следующие элементы управления, которые появляются **только при наведении курсора**:
- **Ручка перетаскивания** - для перемещения виджета по доске
- **Кнопка удаления** - для удаления виджета с доски
- **Элемент изменения размера** - для изменения габаритов виджета
- **Меню настроек** - для настройки специфичных параметров виджета

Когда курсор не наведен на виджет, все элементы управления скрыты, обеспечивая чистый и неперегруженный интерфейс.

#### Размещение и перемещение
- **Добавление виджета**: При нажатии на кнопку "+" появляется меню выбора виджетов
- **Размещение виджета**: После выбора, виджет "приклеивается" к курсору мыши, ожидая размещения пользователем
- **Плавное перетаскивание** с анимацией для комфортного взаимодействия
- **Свободное позиционирование**: Виджеты могут накладываться друг на друга
- **Границы размещения**: Виджеты не могут выходить за пределы экрана влево и вверх, но могут расширяться вправо и вниз

## Разработка новых виджетов

Для создания нового виджета:

1. Создайте новый файл в директории `widgets/` на основе шаблона `widget-template`
2. Реализуйте необходимую функциональность и пользовательский интерфейс
3. Новый виджет автоматически появится в меню добавления виджетов

## Процесс внедрения нового виджета

1. **Создание файла виджета**:
   - Создайте новый файл в директории `widgets/` с именем, соответствующим функциональности (например, `WeatherWidget.tsx`)
   - Импортируйте базовый шаблон виджета

2. **Определение структуры данных**:
   - Опишите интерфейс для параметров и состояния виджета
   - Определите начальное состояние

3. **Реализация логики**:
   - Разработайте основную функциональность виджета
   - Настройте взаимодействие с внешними API, если необходимо
   - Создайте механизм сохранения и восстановления состояния

4. **Разработка интерфейса**:
   - Придерживайтесь минималистичного дизайна
   - Убедитесь, что виджет адаптируется к различным размерам
   - Реализуйте специфичные настройки

5. **Тестирование**:
   - Проверьте функциональность виджета
   - Убедитесь, что состояние корректно сохраняется и восстанавливается
   - Протестируйте перетаскивание и изменение размера

## Лицензия

MIT 