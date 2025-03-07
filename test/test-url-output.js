const elementHref1 = "https://github.com/pingcap/docs-tidb-operator/issues/new?body=File:%20[/release-1.6/zh/tidb-operator-overview.md](https://docs.pingcap.com/zh/tidb-in-kubernetes/stable/tidb-operator-overview)";

const elementHref2 = "https://github.com/pingcap/docs-tidb-operator/issues/new?body=File:%20[/release-1.6/zh/whats-new-in-v1.6.md](https://docs.pingcap.com/zh/tidb-in-kubernetes/stable/whats-new-in-v1.6)";

const elementHref3 = "https://github.com/pingcap/docs-tidb-operator/issues/new?body=File:%20[/master/en/releases/release-1.6.1.md](https://docs.pingcap.com/tidb-in-kubernetes/dev/release-1.6.1)";

const elementHref4 = "https://github.com/pingcap/docs/issues/new?body=File:%20[/release-8.1/tidb-cloud/tidb-cloud-quickstart.md](https://docs.pingcap.com/tidbcloud/tidb-cloud-quickstart)";

const elementHref5 = "https://github.com/pingcap/docs/issues/new?body=File:%20[/release-8.5/migration-overview.md](https://docs.pingcap.com/tidb/stable/migration-overview)";

const elementHref6 = "https://github.com/pingcap/docs/issues/new?body=File:%20[/release-8.5/sql-statements/sql-statement-admin-check-table-index.md](https://docs.pingcap.com/tidb/stable/sql-statement-admin-check-table-index)";

const elementHref7 = "https://github.com/pingcap/docs-cn/issues/new?body=File:%20[/release-8.5/sql-statements/sql-statement-admin-check-table-index.md](https://docs.pingcap.com/zh/tidb/stable/sql-statement-admin-check-table-index)";

const elementHref = "https://github.com/pingcap/docs/issues/new?body=File:%20[/release-8.5/basic-features.md](https://docs.pingcap.com/tidb/stable/basic-features)";

let relativePath = "";

switch (true) {
    case elementHref.includes("github.com/pingcap/docs-tidb-operator"):
        relativePath = elementHref.match(/File:%20\[([^\]]+)\]/);
        if (relativePath) {
            relativePath = relativePath[1];
            // 删除第三个 / 之前的所有内容
            const parts = relativePath.split('/');
            if (parts.length >= 4) {
                relativePath = '/' + parts.slice(3).join('/');
            }
        }
        break;
    case elementHref.includes("github.com/pingcap/docs"):
        relativePath = elementHref.match(/File:%20\[([^\]]+)\]/);
        if (relativePath) {
            // 删除第二个 / 之前的所有内容
            const parts = relativePath[1].split('/');
            if (parts.length >= 3) {
                relativePath = '/' + parts.slice(2).join('/');
            }
        }
        break;
    default:
        //pass
}


console.log(relativePath);