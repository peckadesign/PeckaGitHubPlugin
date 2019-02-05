setTimeout(function () {
    $(document).ready(function () {
        var prevPage;
        $tasker = $('<div id="github-tasker" class="markdown-body"><div><h2>PeckaHub <span id="github-tasker-progress"></span> </h2><div id="github-tasker-content"></div></div></div>');
        $('body').append($tasker);

        $content = $tasker.find('#github-tasker-content');
        $content.hide();

        $(document).on('click', '#github-tasker h2', function (e) {
            $content.toggle();
        });

        update();

        setInterval(function () {
            update();
        }, 1000);


        function update() {
            var selectedTab = $('.tabnav-tabs .selected').text();

            if (/pull/.test(self.location.href) && /Conversation/.test(selectedTab)) {
                processPullRequestPage();

            } else if (/issues/.test(self.location.href)) {
                processIssuePage();

            } else {
                $content.empty();
                $content.hide();
            }
        }

        function processPullRequestPage() {
            if (prevPage === 'pr') {
                return;
            }

            prevPage = 'pr';
            $content.empty();

            var prContainer = $('<div class="pull-container"></div>');
            var project = $('.container.repohead-details-container strong a').text();
            var PRLabel = project === 'pdproject5' ? 'základ' : 'projekt';
            var testAddress = $('.merge-status-item:contains("Pecka CI / Testovací server")').find('a.status-actions').attr("href");
            var branch = $(".commit-ref.head-ref").first().text();

            if (branch) {
                prContainer.append(createListItem('- hotovo ve větvi `' + branch + '`'));
            }

            if (PRLabel) {
                prContainer.append(createListItem('- PR ' + PRLabel + " " + self.location.href));
            }

            if (testAddress) {
                if (testAddress.indexOf('Nay2014') !== -1) {
                    var ewTestAddress = testAddress.replace('Nay2014', 'Electroworld2015');
                    prContainer.append(
                        createListItem('- K testování na <br/>&nbsp;&nbsp;&nbsp; - ' + testAddress + '<br/>&nbsp;&nbsp;&nbsp; - ' + ewTestAddress)
                    );
                } else {
                    prContainer.append(createListItem('- K testování na ' + testAddress));
                }

            }

            $content.append(prContainer);
        }

        function processIssuePage() {
            $content.empty();

            var basecamp = findPageLink('BC');
            var zendesk = findPageLink('zendesk');
            var prContainer = $('<div class="pr-container"></div>');

            if (basecamp) {
                prContainer.append(createListItem('<a href="' + basecamp + '" target="_blank">Basecamp</a>'));
            }

            if (zendesk) {
                prContainer.append(createListItem('<a href="' + zendesk + '" target="_blank">zendesk</a>'));
            }

            if (prContainer.text()) {
                $content.append(prContainer);
            }

            var commentsWithPR = $('.timeline-comment-wrapper:contains("PR projekt")');

            $.each(commentsWithPR, function (i, val) {
                var prContainer = $('<div class="pr-container"></div>');
                var $comment = $(val);

                var branch = $comment.find('li:contains("hotovo ve")').text();
                var PR = $comment.find('li:contains("PR projekt")').children("a").first().attr("href");
                var PRpdproject = $comment.find('li:contains("PR základ")').children("a").first().attr("href");
                var testServer = $comment.find('li:contains("test")').children("a").first().attr("href");

                if (branch)
                    prContainer.append(createListItem(branch));
                if (PR)
                    prContainer.append(createListItem('<a href="' + PR + '">PR</a>'));
                if (PRpdproject)
                    prContainer.append(createListItem('<a href="' + PRpdproject + '">PR základ</a>'));
                if (testServer)
                    if (testServer.indexOf('nay2014') !== -1) {
                        prContainer.append(createListItem('<a href="' + testServer + '">Test Nay</a>'));
                        prContainer.append(createListItem('<a href="' + testServer.replace('nay2014', 'electroworld2015') + '">Test EW</a>'));
                    } else {
                        prContainer.append(createListItem('<a href="' + testServer + '">Test</a>'));
                    }


                $content.append(prContainer);
            });

            if ($content.text()) {
                prevPage = 'issue';
            }
        }

        function createListItem(text) {
            return $("<li style=\"list-style-type: none;\">" + text + "</li>")
        }

        function findPageLink(pagename) {
            return $('.timeline-comment-wrapper').first().find('strong:contains(' + pagename + ')').children("a").first().attr("href");
        }
    });
}, 500);
