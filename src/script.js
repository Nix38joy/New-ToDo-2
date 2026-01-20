// Класс для звуковых эффектов
class SoundEffects {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }

    // Приятный звук при добавлении задачи
    playAddTask() {
        const now = this.audioContext.currentTime
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.frequency.setValueAtTime(523.25, now) // C5
        oscillator.frequency.setValueAtTime(659.25, now + 0.1) // E5
        
        gainNode.gain.setValueAtTime(0.3, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

        oscillator.start(now)
        oscillator.stop(now + 0.3)
    }

    // Успешный звук при отметке задачи
    playCheckTask() {
        const now = this.audioContext.currentTime
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.frequency.setValueAtTime(659.25, now) // E5
        oscillator.frequency.setValueAtTime(783.99, now + 0.05) // G5
        
        gainNode.gain.setValueAtTime(0.2, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

        oscillator.start(now)
        oscillator.stop(now + 0.2)
    }

    // Звук снятия галочки
    playUncheckTask() {
        const now = this.audioContext.currentTime
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.frequency.setValueAtTime(523.25, now) // C5
        oscillator.frequency.setValueAtTime(392.00, now + 0.05) // G4
        
        gainNode.gain.setValueAtTime(0.15, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

        oscillator.start(now)
        oscillator.stop(now + 0.15)
    }

    // Низкий "бум" звук при удалении задачи
    playDeleteTask() {
        const now = this.audioContext.currentTime
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(150, now)
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.25)
        
        gainNode.gain.setValueAtTime(0.4, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25)

        oscillator.start(now)
        oscillator.stop(now + 0.25)
    }

    // Драматичный звук удаления всех задач
    playDeleteAll() {
        const now = this.audioContext.currentTime
        
        // Первый тон
        const osc1 = this.audioContext.createOscillator()
        const gain1 = this.audioContext.createGain()
        osc1.connect(gain1)
        gain1.connect(this.audioContext.destination)
        osc1.frequency.setValueAtTime(400, now)
        osc1.frequency.exponentialRampToValueAtTime(50, now + 0.5)
        gain1.gain.setValueAtTime(0.3, now)
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
        osc1.start(now)
        osc1.stop(now + 0.5)

        // Второй тон (для глубины)
        const osc2 = this.audioContext.createOscillator()
        const gain2 = this.audioContext.createGain()
        osc2.connect(gain2)
        gain2.connect(this.audioContext.destination)
        osc2.type = 'sawtooth'
        osc2.frequency.setValueAtTime(600, now + 0.1)
        osc2.frequency.exponentialRampToValueAtTime(80, now + 0.6)
        gain2.gain.setValueAtTime(0.2, now + 0.1)
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6)
        osc2.start(now + 0.1)
        osc2.stop(now + 0.6)
    }

    // Звук ошибки (пустое поле)
    playError() {
        const now = this.audioContext.currentTime
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(200, now)
        oscillator.frequency.setValueAtTime(180, now + 0.1)
        oscillator.frequency.setValueAtTime(200, now + 0.2)
        
        gainNode.gain.setValueAtTime(0.15, now)
        gainNode.gain.setValueAtTime(0.15, now + 0.2)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

        oscillator.start(now)
        oscillator.stop(now + 0.3)
    }
}

class Todo {
    selectors = {
       root: '[data-js-todo]',
       newTaskForm: '[data-js-todo-new-task-form]',
       newTaskInput: '[data-js-todo-new-task-input]',
       searchTaskForm: '[data-js-todo-search-task-form]',
       searchTaskInput: '[data-js-todo-search-task-input]',
       totalTasks: '[data-js-todo-total-tasks]',
       deleteAllButton: '[data-js-todo-delete-all-button]',
       list: '[data-js-todo-list]',
       item: '[data-js-todo-item]',
       itemCheckbox: '[data-js-todo-item-checkbox]',
       itemLabel: '[data-js-todo-item-label]',
       itemDeleteButton: '[data-js-todo-item-delete-button]',
       emptyMessage: '[data-js-todo-empty-message]',
    }

    stateClasses = {
        isVisible: 'is-visible',
        isDisappearing: 'is-disappearing',
    }

    localStorageKey = 'todo-items'

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root)
        this.newTaskFormElement = this.rootElement.querySelector(this.selectors.newTaskForm)
        this.newTaskInputElement = this.rootElement.querySelector(this.selectors.newTaskInput)
        this.searchTaskFormElement = this.rootElement.querySelector(this.selectors.searchTaskForm)
        this.searchTaskInputElement = this.rootElement.querySelector(this.selectors.searchTaskInput)
        this.totalTaskElement = this.rootElement.querySelector(this.selectors.totalTasks)
        this.deleteAllButtonElement = this.rootElement.querySelector(this.selectors.deleteAllButton)
        this.listElement = this.rootElement.querySelector(this.selectors.list)
        this.emptyMessageElement = this.rootElement.querySelector(this.selectors.emptyMessage)
        this.sound = new SoundEffects()
        this.state = {
            items: this.getItemsFromLocalStorage(),
            filteredItems: null,
            searchQuery: '',
        }
        this.render()
        this.bindEvents()
    }

        getItemsFromLocalStorage() {
            const rawData = localStorage.getItem(this.localStorageKey)

            if (!rawData) {
                return []
            }   
            
            try {
                const parsedData = JSON.parse(rawData)

                return Array.isArray(parsedData) ? parsedData : []
            } catch {
                console.error('Todo items parse error')
                return []
            }
         
        
    }

        saveItemsToLocalStorage() {
            localStorage.setItem(
                this.localStorageKey,
                JSON.stringify(this.state.items)
            )
        }

        highlightSearchText(text, searchQuery) {
            if (!searchQuery || searchQuery.trim().length === 0) {
                return text
            }

            const query = searchQuery.trim()
            const queryLower = query.toLowerCase()
            const textLower = text.toLowerCase()
            
            if (!textLower.includes(queryLower)) {
                return text
            }

            let result = ''
            let i = 0

            while (i < text.length) {
                const remainingText = text.slice(i)
                const remainingTextLower = remainingText.toLowerCase()
                const index = remainingTextLower.indexOf(queryLower)

                if (index === -1) {
                    result += remainingText
                    break
                }

                result += remainingText.slice(0, index)
                result += `<span class="todo-item__highlight">${remainingText.slice(index, index + query.length)}</span>`
                i += index + query.length
            }

            return result
        }

        render() {
            this.totalTaskElement.textContent = this.state.items.length

            this.deleteAllButtonElement.classList.toggle(
               this.stateClasses.isVisible,
                this.state.items.length > 0
            )

            const items = this.state.filteredItems ?? this.state.items
            const searchQuery = this.state.searchQuery || ''

            this.listElement.innerHTML = items.map(({ id, title, isChecked}) => {
                const highlightedTitle = this.highlightSearchText(title, searchQuery)
                
                return `
             <li class="todo__item todo-item" data-js-todo-item>
           <input 
            class="todo-item__checkbox"
            id="${id}"
            type="checkbox"
            ${isChecked ? 'checked' : ''}
            data-js-todo-item-checkbox
            />
            <label 
            class="todo-item__label" 
            for="${id}"
            data-js-todo-item-label
            >
            ${highlightedTitle}
            </label>
            <button 
            class="todo-item__delete-button" 
            type="button"
            aria-label="Delete"
            title="Delete"
            data-js-todo-item-delete-button
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 5L5 15M5 5L15 15" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

        </button>
        </li>
            `
            }).join('')

            const isEmptyFilteredItems = this.state.filteredItems?.length === 0
            const isEmptyItems = this.state.items.length === 0

            this.emptyMessageElement.textContent = 
                isEmptyFilteredItems ? 'Tasks not found'
                    : isEmptyItems ? 'There are not tasks yet'
                        : ''
        }

        addItem(title) {
            this.state.items.push({
                id: crypto?.randomUUID() ?? Date.now().toString(),
                title,
                isChecked: false,
            })
            this.sound.playAddTask()
            this.saveItemsToLocalStorage()
            this.render()
        }

        deleteItem(id) {
            this.state.items = this.state.items.filter((item) => item.id !== id)
            this.sound.playDeleteTask()
            this.saveItemsToLocalStorage()
            this.render()
        }

        toggleCheckedState(id) {
            let wasChecked = false
            
            this.state.items = this.state.items.map((item) => {
                if (item.id === id) {
                    wasChecked = item.isChecked
                    return {
                        ...item,
                        isChecked: !item.isChecked,
                    }
                }

                return item
            })
            
            // Разные звуки для отметки и снятия отметки
            if (wasChecked) {
                this.sound.playUncheckTask()
            } else {
                this.sound.playCheckTask()
            }
            
            this.saveItemsToLocalStorage()
            this.render()
        }

        filter() {
            const queryFormatted = this.state.searchQuery.toLowerCase()
             
            this.state.filteredItems = this.state.items.filter(({title}) => {
                const titleFormatted = title.toLowerCase()

                return titleFormatted.includes(queryFormatted)
            })
            this.render()
        }

        resetFilter() {
            this.state.filteredItems = null
            this.state.searchQuery = ''
            this.render()
        }

        onNewTaskFormSubmit = (event) => {
            event.preventDefault()

            const newTodoItemTitle = this.newTaskInputElement.value

            if ( newTodoItemTitle.trim().length > 0) {
                this.addItem(newTodoItemTitle)
                this.resetFilter()
                this.newTaskInputElement.value = ''
                this.newTaskInputElement.focus()
            } else {
                // Звук ошибки при попытке добавить пустую задачу
                this.sound.playError()
            }
        }

            onSearchTaskFormSubmit = (event) => {
                event.preventDefault()
            }

            onSearchTaskInputChange = ({target}) => {
                const value = target.value.trim()

                if (value.length > 0) {
                    this.state.searchQuery = value
                    this.filter()
                } else {
                    this.resetFilter()
                }
            }

            onDeleteAllButtonClick = () => {
                const isConfirmed = confirm('Are you sure you want to delete all?')

                if (isConfirmed) {
                    this.sound.playDeleteAll()
                    this.state.items = []
                    this.saveItemsToLocalStorage()
                    this.render()
                }
            }

            onClick = ({target}) => {
                const deleteButton = target.closest(this.selectors.itemDeleteButton)
                
                if (deleteButton) {
                    const itemElement = deleteButton.closest(this.selectors.item)
                    const itemCheckboxElement = itemElement.querySelector(this.selectors.itemCheckbox)

                    itemElement.classList.add(this.stateClasses.isDisappearing)

                    setTimeout(() => {
                        this.deleteItem(itemCheckboxElement.id)
                    }, 400)
                }
            }

            onChange = ({target}) => {
                if (target.matches(this.selectors.itemCheckbox)) {
                    this.toggleCheckedState(target.id)
                }
            }

            bindEvents() {
            this.newTaskFormElement.addEventListener('submit', this.onNewTaskFormSubmit)
            this.searchTaskFormElement.addEventListener('submit', this.onSearchTaskFormSubmit)
            this.searchTaskInputElement.addEventListener('input', this.onSearchTaskInputChange)
            this.deleteAllButtonElement.addEventListener('click', this.onDeleteAllButtonClick) 
            this.listElement.addEventListener('click', this.onClick)
            this.listElement.addEventListener('change', this.onChange)
    }
        
}   
    

new Todo ()