<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\AllowValues;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\AllowValues\AllowFileOperationsController;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;

final class AllowFileOperationsControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function appliesWhatWasCollected(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_values.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $response = $this->get(AllowFileOperationsController::class)->write($this->asked([
            'group' => 10,
            'operations' => [
                ['value' => 'deleteFile', 'grant' => true],
                ['value' => 'readFile', 'grant' => false],
            ],
        ]));

        self::assertSame(204, $response->getStatusCode());
        self::assertSame(['deleteFile'], $this->get(BackendGroups::class)->listOf(10, Scope::FileOperations));
    }

    #[Test]
    public function refusesToGrantAFileOperationThatIsNotThere(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_values.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $response = $this->get(AllowFileOperationsController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['value' => 'burnFile', 'grant' => true]],
        ]));

        self::assertSame(400, $response->getStatusCode());
    }

    #[Test]
    public function offersTheFileOperationsInTheGroupsOfTheGroupForm(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $response = $this->get(AllowFileOperationsController::class)
            ->choices((new ServerRequest('https://example.com/typo3/ajax/visual-permissions/file-operations'))
                ->withAttribute('backend.user', $GLOBALS['BE_USER']));

        /** @var array{title: string, groups: list<array{label: string, values: list<array{value: string, label: string}>}>} $choices */
        $choices = json_decode((string) $response->getBody(), true);

        self::assertSame('Was die Gruppe „%s“ mit Dateien und Verzeichnissen tun darf', $choices['title']);
        self::assertContains('Files: Read', array_column(array_column($choices['groups'], 'values', 'label')['Files'] ?? [], 'label'));
    }

    /**
     * @param array<string, mixed> $body
     */
    private function asked(array $body): ServerRequest
    {
        return (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/allow-file-operations', 'POST'))
            ->withParsedBody($body);
    }
}
