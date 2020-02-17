.PHONY: turbolinks

turbolinks:
	mkdir -p public/vendor
	curl -L https://unpkg.com/turbolinks@5.x/dist/turbolinks.js > public/vendor/turbolinks.js
