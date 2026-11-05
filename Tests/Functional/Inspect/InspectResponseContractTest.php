<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Inspect;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\Inspect\InspectController;

final class InspectResponseContractTest extends FunctionalTestCase
{
    private const RECORDED = __DIR__ . '/../../../Contract/inspect-response.json';

    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    // The values follow the installed core; the shape is what the browser reads
    #[Test]
    public function answersInTheShapeTheBrowserWasRecordedAgainst(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_chain.csv');
        $this->setUpBackendUser(1);

        $response = $this->get(InspectController::class)->inspect(
            (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
                ->withQueryParams(['group' => '10', 'tables' => ['pages']]),
        );

        self::assertFileExists(self::RECORDED);
        self::assertSame(
            $this->shapeOf(json_decode((string) file_get_contents(self::RECORDED), true)),
            $this->shapeOf(json_decode((string) $response->getBody(), true)),
        );
    }

    // A map keyed by target, folder or page carries one shape for all its entries
    private function shapeOf(mixed $value, string $key = ''): mixed
    {
        if (!is_array($value)) {
            return get_debug_type($value);
        }

        if (array_is_list($value) || in_array($key, ['targets', 'named', 'givenBy'], true)) {
            return array_values(array_unique(array_map(
                fn(mixed $entry): string => (string) json_encode($this->shapeOf($entry)),
                array_values($value),
            )));
        }

        ksort($value);
        $shaped = [];
        foreach ($value as $name => $entry) {
            $shaped[$name] = $this->shapeOf($entry, (string) $name);
        }

        return $shaped;
    }
}
