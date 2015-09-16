(function(){
    //пространство имён
    window.App = {
        Models: {},
        Views: {},
        Collections: {}    
    };



    //хелпер шаблона
    window.template = function(id) {
        return _.template($('#' + id).html());
    };
    
    App.Models.Task = Backbone.Model.extend({
        validate: function (attrs) {
            if(! $.trim(attrs.title)) {
                return 'имя задачи должно быть валидным !';
            }
        }
    });
    
    App.Views.Task = Backbone.View.extend({
        initialize: function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },
        tagName: 'li',
        template: template('taskTemplate'),
        render: function() {
            var template = this.template(this.model.toJSON())
            this.$el.html(template);
            return this;
        },
        events: {
            'click .edit': 'editTask',
            'click .delete': 'destroy'
        },
        destroy: function () {
            this.model.destroy();
            console.log(tasks);
        },
        remove: function() {
            this.$el.remove();            
        },
        editTask: function () {
            var newTaskTitle = prompt('Именить задачу. Введите задачу', this.model.get('title'));
//            if(!newTaskTitle) return;
            this.model.set({'title': newTaskTitle},{validate:true});
        }
        
    });
    
    App.Views.AddTask = Backbone.View.extend({
        el: '#addTask',
        
        events: {
            'submit' : 'submit'
        },
        initialize: function () {            
        },
        submit: function (event) {
            event.preventDefault();            
            var newTaskTitle = $(event.currentTarget).find('input[type=text]').val();
            var newTask = new App.Models.Task({ title: newTaskTitle});
            this.collection.add(newTask);
        }
    });
    
    App.Collections.Task = Backbone.Collection.extend({
        model: App.Models.Task
    });

    App.Views.Tasks = Backbone.View.extend({
        tagName: 'ul',
        
        initialize: function () {
        this.collection.on('add', this.addOne, this)
        },
        render: function() {
            this.collection.each(this.addOne, this);
            return this
        },
        addOne: function(task) {
            var taskView = new App.Views.Task({model: task});
            this.$el.append(taskView.render().el);
        }
    })
    
    window.tasks = new App.Collections.Task([{
        title: 'Сходить за хлебом',
        priority: 3
    },{
        title: 'Сходить на турнички',
        priority: 4
    },{
        title: 'Поработать как следует',
        priority: 5
    }]);
    
    var tasksView = new App.Views.Tasks({collection: tasks})
    
    $('.tasks').html(tasksView.render().el);
    
    var addTaskView = new App.Views.AddTask({ collection: tasks}); //не очень понял
}());
