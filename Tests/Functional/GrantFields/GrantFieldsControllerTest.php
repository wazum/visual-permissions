<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\GrantFields;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\GrantFields\GrantFieldsController;

final class GrantFieldsControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    protected function setUp(): void
    {
        parent::setUp();
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_fields.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
    }

    #[Test]
    public function appliesWhatWasCollected(): void
    {
        $response = $this->get(GrantFieldsController::class)->write($this->asked([
            'group' => 10,
            'operations' => [
                ['field' => 'tt_content:subheader', 'grant' => true],
                ['field' => 'tt_content:imageorient', 'grant' => false],
            ],
        ]));

        self::assertSame(204, $response->getStatusCode());
        self::assertSame(['tt_content:subheader'], $this->get(BackendGroups::class)->listOf(10, Scope::Fields));
    }

    #[Test]
    public function refusesToGrantWhatCannotBeGranted(): void
    {
        $response = $this->get(GrantFieldsController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['field' => 'tt_content:no_such_field', 'grant' => true]],
        ]));

        self::assertSame(400, $response->getStatusCode());
        self::assertSame('tt_content:imageorient', $this->fieldsOf(10));
    }

    #[Test]
    public function takesAwayWhatCanNoLongerBeGranted(): void
    {
        $response = $this->get(GrantFieldsController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['field' => 'tt_content:no_such_field', 'grant' => false]],
        ]));

        self::assertSame(204, $response->getStatusCode());
    }

    private function fieldsOf(int $groupId): mixed
    {
        return $this->getConnectionPool()
            ->getConnectionForTable('be_groups')
            ->fetchOne('SELECT non_exclude_fields FROM be_groups WHERE uid = ?', [$groupId]);
    }

    /**
     * @param array<string, mixed> $body
     */
    private function asked(array $body): ServerRequest
    {
        return (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/grant-fields', 'POST'))
            ->withParsedBody($body);
    }
}
