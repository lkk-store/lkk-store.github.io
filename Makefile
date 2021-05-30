download:
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 store store
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 pages pages
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 upcoming upcoming
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 blog blog
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 wood wood

go:
	git add .
	git commit -m "$m"
	git push

run:
	node bin/index.js

webp:
	for file in png/* ; do \
		cwebp -q 80 $${file} -o "$${file%%.*}.webp" ; \
	done
	mv png/*.webp img
	rm -rf png/*.webp