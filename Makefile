download:
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 website rows

go:
	git add .
	git commit -m "$m"
	git push

run:
	node bin/index.js