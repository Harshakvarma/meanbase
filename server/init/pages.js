	var demoHome = {
		"author": "Admin",
		"visibility": "basic",
		"url": "/",
		"tabTitle": "meanbase",
		"template": "home",
		"title": "meanbase",
		"content": [
			{"location": "content-1", "text": "Meanbase is a CMS built on the MEAN stack and made to be simple and intuitive for users and developers."},
			{"location": "content-2", "text": "<h3>Simple</h3><p>Meanbase is designed from the ground up to be simple for an average user to learn so you can hand over your product for them to update without stress and training.</p>"},
			{"location": "content-3", "text": "<h3>Fast</h3><p>Meanbase CMS runs off of the MEAN stack: Mongo, Express, Angular, and Node meaning it's generally faster than other web technologies so you don't have to wait for every page to refresh when making edits.</p>"},
			{"location": "content-4", "text": "<h3>Developer Friendly</h3><p>Meanbase is also focused on making the process of creating themes, modifying the CMS, and adding extensions&nbsp;delightful for developers who have to interact with the code every day. It's provides you control and simplicity so you can spend more time focusing on what matters.</p>"}
		],
		"description": "A demo home page created automatically in meanbase.",
		"summary": "A demo home page created automatically in meanbase.",
		"published": true
	};

	var tutorial = {
		"author": "Admin",
		"visibility": "basic",
		"url": "/tutorial",
		"tabTitle": "meanbase - tutorial",
		"template": "page",
		"title": "Tutorial",
		"content": [{"location": "content-1", "text": "Create your themes in client/themes/ folder. Use generator-angular-fullstack to understand project structure. "}],
		"description": "A tutorial to get you running with meanbase.",
		"summary": "A tutorial to get you running with meanbase.",
		"published": true
	};

	var article = {
		"author": "Admin",
		"visibility": "basic",
		"url": "/why-cms",
		"tabTitle": "Why a CMS?",
		"template": "article",
		"title": "Why use a CMS",
		"content": [{"location": "content-1", "text": "A CMS allows you to put control of the website into a user's hands so you don't have to be called everytime they need to make small changes. It means you can focus on the fun things like building themes and extensions while your customers can write the content themselves."}],
		"description": "Why do we need a CMS?",
		"summary": "A reason to use a CMS",
		"published": true
	};

module.exports = [demoHome, tutorial, article];
