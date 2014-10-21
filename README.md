**GitBook PlantUml Plugin**
==============

This is a sample plugin for GitBook and is specially adapted for GitBook from [PlantUML](http://www.plantuml.com/index.html). Gitbook PlantUml plugin is used to select from markdown uml and converting it into a picture format svg.

**Example:**

*Text format dot:*

@startuml

	Class Stage
	Class Timeout {
		+constructor:function(cfg)
		+timeout:function(ctx)
		+overdue:function(ctx)
		+stage: Stage
	}
 	Stage <|-- Timeout

@enduml

![](./images/uml.png)

***Image uml. ***

**How to use it:**
--------------

Gitbook PlantUml plugin can be installed from NPM using:

```$ npm install gitbook-plantUML```

***Additional requirements:***

 - Create a directory */assets/images/uml* in the root of your project.
 - [Install PlantUML.](http://www.plantuml.com/download.html)
